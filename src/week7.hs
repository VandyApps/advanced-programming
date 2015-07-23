-- 
-- Week 6 - Introduction to Programming in Haskell 2
-- 
-- - If statements
-- 
-- - Case statements
--
-- - Guards
-- 


--        name        name,  number    number
lookup :: String -> [(String, Int)] -> Maybe Int
lookup key [] = Nothing
lookup key ((x, y):xys)
    | key == x = Just y 
    | otherwise = lookup key xys
