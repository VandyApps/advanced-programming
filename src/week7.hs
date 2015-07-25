-- 
-- Week 6 - Introduction to Programming in Haskell 2
-- 
-- - If statements
-- 
-- - Case statements
--
-- - Guards

-- Last week we started using Haskell for the first time. We learned more
-- about Haskell's type system and wrote a few simple functions using
-- pattern matching. This week, we're going to learn how to write very
-- simple programs.

-- |  IF STATEMENTS  |

-- Just like in imperative languages, Haskell has if statements.
--
-- Once again, I'm writing some software to see if a person is married. The
-- `User` data type is represented as a tuple.

type User = (String, Boolean)

-- The `type` statement is similar to a `typedef` declaration in other
-- languages. It allows us to give a name to a datatype created from other
-- types. In this case, the `User` type has a `String` for the person's
-- name and a `Boolean` for their marriage status.

-- Let's write a function definition to determine if a person is married.

isMarried :: User -> Boolean
isMarried x = if snd x
                then true
                else false

-- This function can be simplified (do you see how?), but for the time
-- being, let's just consider this version of the function. The `snd`
-- function retrieves the second value in a tuple for us. If that value is
-- `true`, then we return `true`, otherwise we return `false`.
--
-- Take note that nowhere do we specify a return value. The return value
-- for a Haskell function is whatever value was last evaluated in that
-- function. (The `return` keyword means something different in Haskell, as
-- we will soon see.)

-- That function is quite simple, and does exactly what we need it to do.
-- However, what if we have a more complicated datatype to represent
-- relationship status?

data RelationshipStatus = Single | Married | Divorced | Separated

-- We just defined a new data type using the `data` keyword. In this case,
-- we defined an enum, but we could have defined a different data type
-- entirely. We now have four values to consider when we look at a person's
-- relationship status.


-- How can we rewrite our marriage function to return true only if the
-- person is currently married or separated.
--
-- First, we need to update our `User` datatype.

type User = (String, RelationshipStatus)

-- Next, let's rewrite the `isMarried` function, again using if-statements.

isMarried :: User -> Boolean
isMarried x = do let status = snd x
                 if (status == Single) || (status == Separated)
                   then false
                   else true

-- Woah, two new keywords. First, let's consider the `do` keyword. We'll
-- go in depth on how `do` does its magic in another session, but for now
-- we can just say that `do` allows us to perform a series of actions in
-- sequence. 
--
-- In this case, we bind `snd x` to the `status` value. This is
-- similar to variable assignment, except that `status` is guaranteed to
-- never take on another value in the rest of the `isMarried` function
-- – i.e. `status` is _immutable_.
--
-- If we were returning anything other than a boolean value, we might have
-- needed to use an `else if` clause similar to the ones in many other
-- languages. Surprise! Haskell doesn't have an `else if` clause.

-- |  CASE STATEMENTS  |

-- The above function is alright, but it can be written even simpler. In
-- fact, we don't use `if-else` statements a ton in Haskell because we have
-- so many other ways to branch during decision making. That's why we don't
-- need an `else if` clause!
--
-- The first branching statements we're going to consider is the _case
-- statement_. Unlike case statements in many other languages, the Haskell
-- function doesn't require you to explicitly type the `break` keyword,
-- which means it's much safer to use. It's also much easier to use because
-- it can be used on all datatypes – even user-defined objects.

isMarried :: User -> Boolean
isMarried x = case snd x of
                Married -> true
                Separated -> true
                _ -> false

-- The case statement didn't save us any typing, but it makes the intent of
-- our function much clearer. Now it is easy for the casual reader to see
-- that only `Married` and `Separated` statuses return a true value, while
-- everything else returns false. The `_` character tells Haskell's pattern
-- matching system that we want to capture all other values in this last
-- case and return false for them.
--
-- Another benefit to using the case statement is that we didn't need to
-- bind `snd x` to a variable to avoid typing. The case statement let's us
-- do an operation in its switch clause that is used for all of the cases.
--
-- We'll see more examples of case statements as we write more Haskell
-- code.

-- |  GUARDS  |

-- Another kind of Haskell branching structure is called a guard. Guards
-- allow us to do the kind of `if-else` branching with several `else-if`
-- clauses as is commonly seen in other languages, but without the extra
-- typing and clutter.
--
-- Imaging that we want to be able to look up a User's relationship status
-- by their name. You can imagine the data structure looks sort of like
-- a key-value hashmap. For mapping operations that don't need to be extra
-- fast (just kinda fast), we can simply use an array of tuples.
--
-- For this function, we will use the full datatype instead of the
-- abbreviations we created earlier. What would the type signature for
-- this function look like?
--
-- We want to take a name :: `String`
--
-- And a tuple of name and relationship status :: 
-- `(String RelationshipStatus)`
--
-- And we want to return the `RelationshipStatus` only if the name is
-- found. For this part, what monad can we use? Hint: We learned about it
-- in our third tutorial on JavaScript.
--
-- We'll call this function `lookup`.

--        name        name,      status                     status
lookup :: String -> [(String, RelationshipStatus)] -> Maybe RelationshipStatus
lookup key [] = Nothing
lookup key ((x, y):xys)
    | key == x = Just y 
    | otherwise = lookup key xys

-- Let's first take a look at the parts of this function that we already
-- understand:
--
-- 1. Type signature – As we hinted before, we are returning a Maybe value
--    for the relationship status because it is possible for us to
--    unsuccessfully look up a name in our mapping.
--
-- 2. Pattern matching – We have two pattern matching cases here: The first
--    case captures empty lookup tables. For this case, we return `Nothing`
--    to indicate a failed lookup.
--
--    The second case captures all other values (i.e. non-empty tables).
--    First we bind `key` to the name we are searching for. Then, we see
--    this statement: `((x, y):xys)`. We know that the lookup table
--    consists of an array of tuples. This statement breaks off the first
--    tuple in that array and binds the name (key) value to `x`, and the
--    relationship status (value) to `y`. It binds the rest of the
--    array of tuples to `xyz`.
--
-- Now let's address the parts of this function that we haven't learned
-- about (or haven't seen in a Haskell context) yet. There two ideas here:
-- guards and recursion.
--
-- 1. Guards – Like our case statement, guards allow us to branch more
--    easily than an if-statement. We generally use guards when we want to
--    test a series of equalities (i.e. write boolean tests) rather than
--    pattern match on the data itself like in a case statement.
--
--    In this case, our guard first tests to see if the `key` value is
--    equivalent to `x`, the `key` value in the first tuple in our table.
--    If it is, then we return the value on the right side of the `=` sign.
--    In this case, we return `Just y`, which means that we wrap
--    the `RelationshipStatus` value corresponding to this user's name in
--    the `Maybe` monad before returning it.
--
--    In the second case, we use `otherwise` as convention to indicate that
--    we should capture all other cases here. On the right side, we
--    recurse.
--
-- 2. Recursion – Haskell doesn't have loops (WHAT!?!?!?!?). Yep, it's
--    true. Instead, we use recursion if we have to loop. As you'll see,
--    this can simplify many otherwise complex problems.
--
--    In this case, after we have inspected the first value in the lookup
--    table and found that it doesn't match our search value (i.e. we are
--    in the `otherwise` clause), we continue by searching the rest of the
--    array (everything except the first value). Fortunately, Haskell made
--    it easy for us to bind the rest of the array to `xyz` in our pattern
--    matching, so we just pass that to our call to `lookup`.

-- In our `lookup` function, we only had to switch between two cases. The
-- syntax is nice, but it doesn't help us as much as if we had to switch
-- between a few more. Here's an example.

-- Let's say that former engineers at our company (they are former for
-- a reason...) decided that we should encode relationship statuses as
-- integers in our JSON api. Unfortunately, that API can't be deprecated
-- since we still have clients on it, so we need a way to transform on of
-- our maps from using numeric values to our fancy `RelationshipStatus` type
-- that is backed by the Haskell compiler.

decodeStatuses :: (String, Integer) -> (String, RelationshipStatus)
decodeStatuses key n
    | n == 1 = Single
    | n == 2 = Married
    | n == 3 = Separated
    | otherwise = Divorced

-- That function does exactly what we want, and it is quite readable. It
-- even saves us some space, given that we don't have to deal with several
-- `if-else` clauses cluttering up what is otherwise a very simple
-- operation.
