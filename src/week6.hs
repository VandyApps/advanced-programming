-- 
-- |  Week 6 -  Introduction to Programming in Haskell 1  |
-- 
-- - Installation directions (email out)
-- 
-- - Types
-- 
-- - Writing simple (pure) functions.
-- 
-- - Using the REPL.
-- 
-- - Pattern matching.
-- 
-- - Resources:
--   http://learnyouahaskell.com/
-----------------------------------------

--  It's the moment you've all been waiting for. Or, perhaps, dreading. Today,
--  we begin our exploration of Haskell and how thinking in types and pure
--  functions can help us become better programmers.


-- |  INSTALLATION  |
-- 
--  Most people use the GHC Haskell compiler, so we're going to install that
--  as part of the Haskell platform, which includes a bunch of other tools that
--  will help make our lives easier. The platform takes a while to install, so
--  you're best off getting started early.
-- 
--  https://www.haskell.org/platform/
-- 
--  Once you have Haskell set up, try getting a REPL going at the command line.
--  You can launch your REPL by going into your friendly neighborhood terminal
--  and typing `ghci`. Play around.


-- |  TYPES  |
-- 
--  In our discussion of JavaScript since the start of the semester, we've
--  actually been using Haskell types to describe our functions along the way.
-- 
--  Remember, Haskell type signatures look like this:
-- 
--  String -> Int -> (String -> Int) -> Int
--  ^param1   ^param2 ^function param1 ^return val
-- 
--  In words, this function takes a string, an integer, and a function that
--  returns an integer when given a string, and returns an integer.
-- 
--  To get a little more practice, let's define the type signatures of a few
--  common Haskell functions.
-- 
--  1. Appending two lists
--  (++) :: [a] -> [a] -> [a]
-- 
--  Example: [1, 2, 3] ++ [4, 5, 6] -- => [1, 2, 3, 4, 5, 6]
-- 
--  The type of the list append function is abstract, meaning that we can pass
--  two lists of any type, as long as they are the _same_ type, to the function
--  and it will append them. Note that the variable `a` used in the type
--  signature is arbitrary (we use `a` by convention), but all three of the
--  variables in the type signature must be the same to indicate that append
--  only appends lists of the same type.
-- 
--  2. Adding two numbers
--  (+) :: Num a => a -> a -> a
-- 
--  Example: 2 + 3 = 4
-- 
--  Does adding two strings together make sense? No? I didn't think so. To rule
--  the possibility of us adding strings together out, the Haskell designers use
--  typeclasses. 
-- 
--  In this case, you can only add two values if their types exist
--  in the typeclass `Num`. Any guesses what kinds of values implement the
--  Typeclass `Num`? That's right, Int, Double, etc. Basically anything numeric
--  that can be added together.
-- 
--  3. Map
--  map :: (a -> b) -> [a] -> [b]
-- 
--  Example: map (\x -> x + 3) [1, 2, 3, 4] -- => [4, 5, 6, 7]
-- 
--  This one is a little more tricky. We studied map operations in JavaScript
--  all the way back in week 2, so let's refresh. Map takes a function and
--  a list, and applies that function to every element in the list to produce
--  a new list.
-- 
--  Can we see how that is symbolized in this type signature? `a` represents the
--  original type of the values in the first array, and `b` represents the type
--  of the values in the resulting array. Our function maps all of our `a`
--  values into corresponding `b` values.


--  |  SIMPLE FUNCTIONS  |
-- 
--  Let's write a few simple functions in Haskell. First, let's start with
--  a function that takes a list of people and their phone numbers and looks up
--  a phone number given the name of a person.
--
-- Here's an addition function:

addThings :: Int -> Int -> Int
addThings x y = x + y

-- As you can see, parameters go next to our function name on the left hand
-- side of the second line, and the "formula" for our method goes on the
-- right hand side of the equals symbol.
--
-- Here's another function that returns the number of elements in an array.
-- It could be simpler, but we're going to make it a bit more complicated
-- than it needs to be in order to show off pattern matching.

countArray :: [a] -> Int
countArray [] = 0
countArray [x] = 1
countArray xs = count xs

-- As you can see, we've set up multiple "patterns" for this function to
-- match against. The function will first check if the array is empty `[]`.
-- If it is, it will return 0. If not, it will check if the array contains
-- one single element. If not, it will fall back to the last case, which
-- simply directs Haskell to bind the entire list to the vairable xs. We
-- then use the built-in `count` function to count the number of elements
-- in the list.

-- In our discussion of the map function in JavaScript, we learned that the
-- type signature for a map operation looks like this:
--
-- (a -> b) -> [a] -> [b]
--
-- In words, this represents the idea that the map function takes
-- a function that transforms values of type `a` into values of type `b`
-- as the first parameter and a list of values of type `a` as the second
-- parameter, and returns a list of values of type `b`.
--
-- In that session, we considered a list of people and wanted to set all of
-- the people in the list to married. Let's do the same thing in Haskell.

unmarried :: [(String, Boolean)]
unmarried = [("John", false), ("Mary", false), ("Lee-Ann", false)]

-- The above type signature tells us that the list of unmarried people is
-- maid up of tuples that contain a `String` in the first position and
-- a `Boolean` in the second.
--
-- Let's write a function that uses `map` to transforms our data.

setMarried :: [(String, Boolean)] -> [(String, Boolean)]
setMarried = map (\(name, married) -> (name, false)) 

-- This function unpacks each of the person tuples into a name value and
-- a married value on the left side of the arrow. On the right side of the
-- arrow, we modify the second value when we create our new tuples.
--
-- You might notice something odd with this function. Where are our
-- parameters? In the functions we've seen up to this point, parameters go
-- on the left side of the '=' sign. In Haskell, if the parameter happens
-- to be the last value on the right side of the equation, we can "cancel"
-- the parameter from both sides of the equation. We call this POINT FREE
-- FORM.
--
-- The function could have also been written like this:

setMarried :: [(String, Boolean)] -> [(String, Boolean)]
setMarried xs = map(\(name, married) -> (name, false)) xs

-- To finish up here, we will also note that in Haskell, defining the type
-- signature of most funtions isn't required. However, it is highly
-- advised, as it helps you think about your function inputs while you
-- program and gives better hints to the compiler.
