func (s *Store) CreateFileUploadIntent(ctx context.Context, displayName string, ownedBy int, parentFolder sql.NullInt64, size int, contentType string) (int64, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return 0, err
	}
	defer func() {
		_ = tx.Rollback()
	}()
	var quota, quotaUsed int
	err = tx.QueryRowContext(ctx, "SELECT quota, quota_used FROM Users WHERE id = ?", ownedBy).
		Scan(&quota, &quotaUsed)
	if err != nil {
		return 0, err
	}

	if quotaUsed+size > quota {
		return 0, ErrQuotaExceeded
	}

	result, err := tx.ExecContext(ctx, "INSERT INTO Files (display_name, owned_by, size, parent_folder, content_type, status, bytes_received) VALUES (?,?,?,?,?,'Uploading',0)", displayName, ownedBy, size, parentFolder, contentType)
	if err != nil {
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	_, err = tx.ExecContext(ctx, "UPDATE Users SET quota_used = quota_used + ? WHERE id = ?", size, ownedBy)
	if err != nil {
		return 0, err
	}

	if err := tx.Commit(); err != nil {
		return 0, err
	}

