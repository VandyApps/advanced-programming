-- Week 9 - Typeclasses 101
-- 
-- - Type classes
--
-- - Typeclasses are similar to interfaces in OOP
--
-- - Build on binary tree example and use typeclass for its operations
-- 
-- - Bencoding example
--
-- References:
--   https://www.haskell.org/tutorial/classes.html
--   http://www.bittorrent.org/beps/bep_0003.html
--   https://github.com/dblarons/torrskel/blob/master/src/Bencode.hs

-- |  TYPE CLASSES  |

-- When we introduced data types last week, we mentioned that you could
-- extend these data types using the `deriving` keyword. For instance, we
-- extended the `RelationshipStatus` data type like so:

data RelationshipStatus = Single | Married | Divorced | Separated deriving (Show, Enum, Eq, Ord)

-- Show, Enum, Eq, and Ord are all instances of *type classes* in Haskell.

-- |  AN ASIDE ON INTERFACES IN OO PROGRAMMING  |

-- Let's consider a common problem in object-oriented languages. Imagine
-- that we write a mobile game that has two game modes. Each of these game
-- modes has similar features, (a) a pause HUD layer, (b) a HUD for your points
-- or time left, and (c) a HUD for in-app purchases.
--
-- |--------------------------------|
-- |(b)10sec               (b)10pts |
-- |                                |
-- |                                |
-- |                                |
-- | (c)(c)(c)  (a)pause            |
-- |--------------------------------|
--
-- We write a set of functions that we want to behave similarly on each
-- game mode: pausing the game, animating an IAP, where to place the points
-- labels. At first, we think that we should use inheritance to encapsulate
-- similar features of each HUD layer. However, we realize that the
-- similarities between the HUD elements themselves only go so deep.
--
-- Instead, we realize that we should use interfaces. By using interfaces,
-- we can still use our library of functions uniformly in each game mode,
-- but our GUI itself (the part that is different for both game modes) can
-- be isolated from these actions.
--
-- Let's consider the in-app purchase layer.
--
-- Here are the functions we define in our interface. These functions must
-- be defined in each game mode because they are game-specific.
--     setupUI()
--     getPowerupIdForPowerup(Powerup powerup)
--  
-- And these are the functions that act on this interface. They behave the
-- same way regardless of which game mode we are in:
--     pauseGame()
--     resumeGame()
--     initiatePurchase(powerupId)
--
-- By using interfaces, we can reuse the `pauseGame()`, `resumeGame()` and
-- `initiatePurchase(...)` functions for both game modes. But since these
-- functions depend on functions in the interface, we must implement the
-- interface before they will work.

-- |  BINARY TREE EXAMPLE  |

-- Haskell's typeclasses work similarly to interfaces in object oriented
-- languages. Let's take another look at our `RelationshipStatus`
-- typeclass.

data RelationshipStatus = Single | Married | Divorced | Separated deriving (Eq)

-- By deriving the `Eq` typeclass, we indicate to Haskell that we want to
-- be able to use the `(==)` and `(/=)` functions. 
--
-- The _typeclass_ for `Eq looks like this:

class Eq a where
    (==), (/=)            :: a -> a -> Bool
    x /= y                =  not (x == y)

-- As it turns out, we only need to define one of `(==)` or `(/=)`, because
-- they are defined in terms of each other.
--
-- How would we implement the equality operation for our binary tree
-- typeclass from last week?

data Tree a = Branch (Tree a) (Tree a) | Leaf a

-- Firstly, we can make the assumption that the values contained within its
-- nodes, abstractly referred to as `a`, have `Eq` already implemented. Now
-- we can build a definition for our own binary tree equality function:

instance (Eq a) => Eq (Tree a) where 
    Leaf a         == Leaf b          =  a == b
    (Branch l1 r1) == (Branch l2 r2)  =  (l1==l2) && (r1==r2)
    _              == _               =  False

-- This definition says that two leafs are equivalent if the values that
-- they contain are equivalent. Likewise, two branches are equivalent if
-- their two children are equivalent (this is then evaluated recursively).
-- Anything else – `Branch == Leaf` being one example – is considered false.

-- |  BENCODING EXAMPLE  |

-- Now let's try a slightly more complicated example. Imagine that we are
-- writing a torrent client in Haskell. Torrent files use a format somewhat
-- similar to JSON called Bencoding. Bencoding has the following
-- properties:
--
-- (The following is from the Bittorrent spec found here:
-- http://www.bittorrent.org/beps/bep_0003.html)
--
-- 1. Strings are length-prefixed base ten followed by a colon and the string.
--       Ex. 4:spam
--
-- 2. Integers are represented by an 'i' followed by the number in base 10
--    followed by an 'e'.
--       Ex. i3e => 3
--           i-3e => -3
--    Integers have no size limitation. i-0e is invalid. All encodings with
--    a leading zero, such as i03e, are invalid, other than i0e, which of
--    course corresponds to 0.
--
-- 3. Lists are encoded as an 'l' followed by their elements (also bencoded)
--    followed by an 'e'. 
--       Ex. l4:spam4:eggse => ['spam', 'eggs']
--
-- 4. Dictionaries are encoded as a 'd' followed by a list of alternating
--    keys and their corresponding values followed by an 'e'.
--       Ex. d3:cow3:moo4:spam4:eggse => {'cow': 'moo', 'spam': 'eggs'}
--           d4:spaml1:a1:bee => {'spam': ['a', 'b']}
--    Keys must be strings and appear in sorted order (sorted as raw
--    strings, not alphanumerics).

-- First, we need to be able to encode our data within Haskell in a uniform
-- format. We can use the `data` keyword to create a new type to represent
-- our Bencoded data.

data BType
    = BString   String
    | BList     [BType]
    | BInteger  Integer
    | BDict     [(String, BType)]
    deriving (Eq, Show)

-- `BList` and `BDict` are a list of `BType`'s and a list of tuples
-- respectively.
--
-- How would we encode a `BType` structure into a string so that we follow
-- the Bittorrent specification? (Let's assume that all `BType`
-- dictionaries are already sorted).
--
-- First, this function would need to act on all of the 4 possible `BType`
-- types, but it would need to behave differently for each one. Sounds like
-- a great use for typeclasses.

class Encode a where
    -- |Given a type that can be Bencoded, invoke the correct encoding
    -- function.
    encode :: a -> String

-- The `Encode` typeclass is very simple. It only defines one function,
-- `encode`, that takes one parameter, `a`, and returns a string.
--
-- Creating a typeclass was simple, but in order to use it, we have to
-- create "instances" of this typeclass for each of our `BType`'s.
--
-- Let's start with the integer encoding.

instance Encode BType where
    -- |Encoding integers.
    encode (BInteger i) = "i" ++ show i ++ "e"

-- The integer type is quite simple, we make an instance of the `encode`
-- function for a `BInteger` and create a new string that matches the
-- BEncoding specification. (Remember, `String`s are lists of `Char`s; the
-- `(++)` function appends two lists together).

-- Next, let's implement the `BString` type.

instance Encode BType where
    -- |Encoding integers.
    encode (BInteger i) = "i" ++ show i ++ "e"

    -- |Encoding strings.
    encode (BString xs) = show (length xs) ++ ":" ++ xs

-- Again, simple. We can now act on our `BInteger` and `BString` types
-- uniformly.
--
-- Ex.
--   encode (BInteger 4) => "i4e"
--   encode (BString "foobar") => "6:foobar"
--
-- Encoding the `BList` type will be a bit more complicated. The spec
-- states that a list will consist of BEncoded types, which should
-- immediately indicate to us that the `encode` function for lists will be
-- recursive. How can we recursively move through a list, building up
-- a string along the way?
--
-- Try to remember way back to week 2, when we studied the `reduce`
-- function in JavaScript. This function allows us to take a list of
-- things and reduce it into one thing. In Haskell, we call this operation
-- a `fold` (as in, I'm going to "fold" or "collapse" this list into
-- a smaller thing).

instance Encode BType where
    -- |Encoding integers.
    encode (BInteger i) = "i" ++ show i ++ "e"

    -- |Encoding strings.
    encode (BString xs) = show (length xs) ++ ":" ++ xs

    -- |Encoding lists.
    encode (BList []) = "le"
    encode (BList xs) = "l" ++ foldl (\a x -> a ++ encode x) "" xs ++ "e"

-- Let's break this definition down. First, empty `BList`s are simply
-- represented by "le". If our list contains elements, we add an "l" to the
-- front of the string, then we reduce the string recursively. We encode
-- each element, then append it to the end of the string we are
-- constructing, then grab another element. Finally, we finish our string
-- off with an "e".

instance Encode BType where
    -- |Encoding integers.
    encode (BInteger i) = "i" ++ show i ++ "e"

    -- |Encoding strings.
    encode (BString xs) = show (length xs) ++ ":" ++ xs

    -- |Encoding lists.
    encode (BList []) = "le"
    encode (BList xs) = "l" ++ foldl (\a x -> a ++ encode x) "" xs ++ "e"

    -- |Encoding dictionaries.
    encode (BDict xs) = "d" ++ foldDict ++ "e"
        where foldDict = foldl (\a x -> a ++ encode (BString $ fst x) ++ encode (snd x)) "" xs

-- The syntax for our `BDict` instance is a little tricky. We'll step
-- through it now and then cover some of the more complicated operators in
-- another session.
--
-- Like the `BList` instance, we use `fold` to collapse our `BDict` type into
-- a `String`. This time, however, we make two calls to `encode`. The
-- second call, like the one for `BList` simply encodes another `BType`.
-- The call, however, knows to always encode `BString`s. Why is this? Well,
-- we are guaranteed by the specification that the keys to the `BDict` type
-- are always strings.
--
-- The `where` clause simply allows us to extract our folding function to
-- improve readability. The `$` operator allows us to avoid one more set of
-- parenthesis.
--
-- Now we are all finished with our instance of the `Encode` typeclass. 
--   Ex. encode BList [(BInteger 4), (BString "foo")] => li4e3:fooe
--       encode BDict [("key1", BInteger 4), ("key2", BString "foo")] => d4:key1i4e4:key23:fooe

