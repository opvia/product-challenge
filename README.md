# Opvia Take-home Product Challenge

Congratulations on being selected for the next stage of our interview process!

We really appreciate the time you have invested in the process so far and only invited you to this next challenge because we think there’s a very good chance you’d be a great fit at Opvia. This is the penultimate step in the interview process! For context at this stage the probability of a candidate receiving an offer is (~25%).

This is our only opportunity to see what you can build so we weight it very highly. Please do show us what you can do!

## How to complete this stage of the interview process

1. Please clone this repo and use it as your starting point. This is a simple create-react-app featuring the blueprintjs table component https://blueprintjs.com/docs/#table
2. We have a prettier config to help you format your code better, but please add eslint if you wish.
3. Also feel free to restructure the code base to make it better and add missing types wherever you see fit to gain some brownie points. 🎉
4. Take your time to complete the 'Opvia product problem' below. It's up to you how you go about this!
5. Invite _hfmw_ and _jrans_ to your own repo with your solution when you're done

## Opvia product problem

Here's the situation: scientists are using Opvia to store all their data in a standardised structure in one place. However, it's not very useful for analysis because scientists can't yet apply formulas to the data. You've told a customer that you're building this feature and you're going to demo it to them...

Make it possible for users to add `calculation columns`:

- The user should be able to add new derived properties of a record by writing a formula that can specify other columns to calculate with.
- This is the functionality required you've identified with the user:
  - Column based basic maths (addition, multiplication etc.) (e.g. multiplying cell density column and volume column -> cell count)
  - Row based formula (e.g. show the rate of change of the calculated cell count)

### What we're looking for

Something that meets the above minimal requirements and can act as a starting point to get more feedback on.

Unsure whether to submit? Would you happily sit down with a scientist and show them what you've built? Would what you've showed them make them more excited about using Opvia?

Ran out of time? Document any features that you'd like to have built.

#### FAQS

- Can I change the structure/content of the raw data? - yes feel free to, but don't feel obligated to (this is a product not and engineering challenge)

#### Any questions

If you have any questions, or anything is unclear please email Jack at `jack.rans@opvia.bio`



## More features I would like and report

Whilst the basic functionality is working I would've liked to approach it ideally in a different way.

#### Better parsers / evaluators  

perhaps use cortexJS to parse the input which would've produced a better AST. I can then fill in the variables with a map<columnId,variableId>

perhaps being able to use CortexJS's LiveMath package would've been good for the input and certainly for Column based math, it would've been
fairly easy to do. However when calculating the row based formulas, I think it would struggle to understand the concept of a loop and hence why I resorted to a button for the row based calculation

#### Using BlueprintJS -> Table -> onSelected 

This produces a "region" as they call it. you can use cardinality to see if you've selected rows, cells, columns or a table and gives back the respective indices that rectangle so to speak where each corner is a index of a column or row. Using this, one could enable a method of input like Microsite Excel. 

#### Deleting columns and rows

I Think it would've been nice to delete columns and rows

#### Overall interface layout

I would've liked to put the forms closer to the table to make it look all as one.