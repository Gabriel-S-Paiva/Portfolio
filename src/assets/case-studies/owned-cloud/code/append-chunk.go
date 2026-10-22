func (s *Store) AppendFileChunk(ctx context.Context, fileId int, chunk io.Reader) (int64, error) {
	file, err := s.GetFileById(ctx, fileId)
	if err != nil {
		return 0, err
	}
	if file.Status != "Uploading" {
		return 0, ErrFileNotUploading
	}

	if err := os.MkdirAll(storageDir, 0755); err != nil {
		return 0, err
	}
	path := filepath.Join(storageDir, strconv.Itoa(fileId))

	f, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return 0, err
	}
	defer f.Close()

	written, err := io.Copy(f, chunk)
	if err != nil {
		return 0, err
	}

	newTotal := file.BytesReceived + int(written)
	status := "Uploading"
	if newTotal >= file.Size {
		status = "Complete"
	}

	_, err = s.db.ExecContext(ctx, "UPDATE Files SET bytes_received = ?, status = ? WHERE id = ?", newTotal, status, fileId)
	if err != nil {
		return 0, err
	}

	return written, nil
