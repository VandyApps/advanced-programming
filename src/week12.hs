readTorrentFile :: FilePath -> IO (Either String TorrentMeta)
readTorrentFile path = do contents <- readFile path
                          case decode contents of
                            Left msg -> return $ Left msg
                            Right val -> case extractTorrentMeta val of
                                           Nothing -> return $ Left "Unable to decode torrent meta file."
                                           Just v -> return $ Right v


readTorrentFile :: FilePath -> ExceptT String IO TorrentMeta
readTorrentFile path = do 
    contents <- liftIO $ readFile path
    val <- ExceptT . return . runExcept $ decode contents
    case extractTorrentMeta val of
      Nothing -> throwE "Unable to decode torrent meta file."
      Just v -> return v


