-- Week 8 - Creating Data Types in Haskell
-- 
-- - data
--
-- - Recursive types
-- 
-- - Binary tree example.
-- 
-- - type
--
-- References:
--   https://wiki.haskell.org/Type
--   http://stackoverflow.com/questions/2649305/why-is-there-data-and-newtype-in-haskell
--   https://www.haskell.org/onlinereport/derived.html

-- |  DATA |

-- There are three functions that allow us to create new types in Haskell:
-- `data`, `type`, and `newtype`. Because of the subtleties of the
-- `newtype` keyword, we are only going to focus on the `data` and `type`
-- keywords.

-- Let's start with `data`. In the last seminar, we saw that `data` can be
-- used similarly to an enum in other languages.

data RelationshipStatus = Single | Married | Divorced | Separated

-- Another way to think of this statement is that we are defining 4 new
-- data constructors, each of which take no parameters. If we want to add
-- properties to this constructor, we can use the `deriving` keyword.

data RelationshipStatus = Single | Married | Divorced | Separated deriving (Show, Enum, Eq, Ord)

-- We just added 4 properties to our `RelationshipStatus` type: Show, Enum,
-- Eq, and Ord. Let's briefly discuss each of them.
--
-- 1. Show – Allows us to print the name of each of our constructors.
--      Ex. print Single -- => "Single"
--
-- 2. Enum – Allows us to use a set of functions from the `Enum` typeclass.
--    Two of these functions are `toEnum` and `fromEnum` which map our
--    enumerated type into an Int type and vice versa.
--      Ex. toEnum Married -- => 1
--
-- 3. Eq / Ord – Allows us to use functions from the `Eq` and `Ord`
--    typeclasses. Usefull functions from these typeclasses include (==),
--    (/=), compare, (<), (<=), (>), (>=), max, and min.

-- The `data` keyword can do more than just create enums. For example, the
-- powerful `Maybe` type is defined using `data`.

data Maybe a = Just a | Nothing

-- Maybe has two different constructors. One of them (Just a) takes a single
-- parameter, while the other (Nothing) does not. The parameter `a` is
-- abstract, meaning that we can pass any type into a `Maybe` constructor.
--
-- We can also define recursive types using the `data` keyword. A popular
-- class of interview questions covers binary trees, which, of course, are
-- recursive. Let's define a binary tree data type in Haskell.

data Tree a = Branch (Tree a) (Tree a) | Leaf a

-- Like the `Maybe` type, `Tree` defines two constructors (separated by the
-- pipe character) and accepts one abstract type, which is used by both
-- constructors.
--
-- Ex. let foo = Leaf "foo"
--     let bar = Leaf "bar"
--     let foobar = Branch foo bar
--
--         foobar
--        /      \
--     "foo"    "bar"
-- 
-- In our definition, `Leaf` is part of the `Tree` datatype. Therefore, we
-- can pass a `Leaf` on either side of the `Branch` constructor to create
-- a branch. We could also pass another branch as a left or right node in
-- a `Branch`
--
-- Ex. let foo = Leaf "foo"
--     let l = Leaf "l"
--     let r = Leaf "r"
--     let bar = Branch l r
--     let foobar = Branch foo bar
--
--          foobar
--         /      \
--      "foo"     bar
--               /   \
--             "l"   "r"
--
-- Hopefully the power of the `data` keyword is quite evident. In my mind,
-- there are two huge benefits: First, creating new datatypes, a very
-- common operation, takes only a few lines of code at most. And second,
-- adding common operations like equality (==, /=, ...), ordering (>=, <,
-- ...), and printing (the Haskell equivalent of `toString()` in Java) to
-- these types requires very little work.
--
-- For comparison, look back to our Maybe data type in JavaScript or try
-- implementing a binary tree class in Java.

-- |  TYPE  |

-- We also saw the `type` keyword in last week's session.

type User = (String, Boolean)

-- `type` is Haskell's souped up equivalent of `typedef` in other
-- languages. While in most other languages, `typedef` simply gives us
-- another name for a type, Haskell of course gives us much more
-- flexibility.
--
-- First, we can change the name of primitive types to give them more
-- meaning in our program's context.
--
-- Imagine you are working with married couples again. We can create
-- a `Name` type to give our function definitions a little more flavor.

type Name = String

getName :: User -> Name
getName = fst

-- Many times, new Haskell programmers can go overboard with giving new
-- names to simple types. Giving new names to more complicated types,
-- however, can be very helpful.
--
-- Imagine that we work for a geneology company. How can we model a user
-- so that we include their family tree as part of the user type?

data Tree a = Branch (Tree a) (Tree a) | Leaf a

type Geneology = Tree
type Parent = Branch
type Child = Leaf
type User = (String, Boolean, Geneology)

-- By giving new names to our `Tree`, `Branch`, and `Leaf` types, we were
-- able to take a generic binary tree data type and fit it into our context
-- without losing any of its power. This makes our code more readable and
-- reusable.
--
-- -- Let's create a family tree for my family.
--
-- Ex. let family = Parent (Child "aaron") (Child "isaac")
--     let father = ("david", true, family)
--
--     ("david", true, geneology)
--                     /       \ 
--                 "aaron"   "isaac"
--
-- When we create a type synonym with `type`, the synonym retains all of
-- the constructors from the original type.
