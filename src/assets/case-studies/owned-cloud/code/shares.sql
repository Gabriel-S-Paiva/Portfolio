CREATE TABLE Shares (
    id INTEGER PRIMARY KEY,
    file INTEGER,
    folder INTEGER,
    shared_with INTEGER NOT NULL,
    permissions TEXT NOT NULL CHECK(permissions IN ('View','Edit')),

    CHECK ((file IS NOT NULL AND folder IS NULL) OR (file IS NULL AND folder IS NOT NULL)),
    FOREIGN KEY (file) REFERENCES Files(id),
    FOREIGN KEY (folder) REFERENCES Folders(id),
    FOREIGN KEY (shared_with) REFERENCES Users(id)
