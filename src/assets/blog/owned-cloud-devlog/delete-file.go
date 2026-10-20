func (s *Store) DeleteFile(ctx context.Context, id int) error {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var userID int
	var fileSize int64

	err = tx.QueryRowContext(ctx, "DELETE FROM Files WHERE id = ? RETURNING owned_by, size", id).
		Scan(&userID, &fileSize)

	if err == sql.ErrNoRows {
		return ErrFileNotFound
	}
	if err != nil {
		return err
	}

	_, err = tx.ExecContext(ctx, "UPDATE Users SET quota_used = quota_used - ? WHERE id = ?", fileSize, userID)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	path := filepath.Join(storageDir, strconv.Itoa(id))
	if err := os.Remove(path); err != nil && !os.IsNotExist(err) {
		return err
	}

	return nil
}
