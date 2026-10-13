	err = tx.QueryRowContext(ctx, "INSERT INTO Folders (display_name, owned_by) VALUES ('root', ?) RETURNING id", user.Id).Scan(&rootFolderId)
	if err != nil {
		return 0, err
	}

	_, err = tx.ExecContext(ctx, "UPDATE Users SET root_folder = ? WHERE id = ?", rootFolderId, user.Id)
	if err != nil {
		return 0, err
	}

	_, err = tx.ExecContext(ctx, "DELETE FROM Requests WHERE id = ?", id)
	if err != nil {
		return 0, err
	}
