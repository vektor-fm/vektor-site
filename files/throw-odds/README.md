# Throw the dice ten times: the odds table and the four reworks

vektor /// no. 062 · @vektor.fm · October 2026

## The odds table

The chance that at least one throw lands, when each throw lands with probability p:

    P(at least one) = 1 - (1 - p)^n

Each throw misses with probability (1 - p). All n throws miss with probability (1 - p)^n. Everything else is "at least one landed".

| throws | 1 in 6 | 1 in 20 | 1 in 100 |
|---:|---:|---:|---:|
| 1 | 16.7% | 5.0% | 1.0% |
| 2 | 30.6% | 9.8% | 2.0% |
| 3 | 42.1% | 14.3% | 3.0% |
| 5 | 59.8% | 22.6% | 4.9% |
| 10 | 83.8% | 40.1% | 9.6% |
| 20 | 97.4% | 64.2% | 18.2% |
| 50 | >99.9% | 92.3% | 39.5% |
| 100 | >99.9% | 99.4% | 63.4% |

Throws needed to reach an even chance (50%): 4 at 1 in 6, 14 at 1 in 20, 69 at 1 in 100.

The full table (1 to 100 throws) is in `odds-table.csv` next to this file. All figures are arithmetic from the formula above, computed 2026-10-03.

The film says "sixteen percent" for one throw. The exact figure is 1/6 = 16.7%; the film rounds down.

## What the table assumes

1. **The same dice every throw.** The table only holds if every throw has the same p. Swap the idea after a miss and you trade a dice you know has a six for one you don't: it might be worse, or have no six at all, and what the last throws taught you stays with the old dice. That is the cost of shiny object syndrome.
2. **The dice has a six on it.** An idea that is wrong is a dice with no six: 0% at any number of throws. More throws do not fix it.
3. **The tray holds the dice.** A market too small, or a problem nobody has, is a tray the dice slides off. The throw never counts.
4. **Each throw is independent.** Real attempts are not: each one teaches you something. That is the good news. If you keep the dice and change the throw, later throws can land more often than the first one did, and the table is a floor, not a ceiling. If you change everything at once, you learn nothing about which change mattered.

## The four things to rework first

Before you swap the dice (the idea) or the tray (the market), rework the throw. The film names four parts of it, in this order:

1. **The product.** Does it do the one job it promises, for the person it is for? Rework where people stall, not where you would like to add something.
2. **The offer.** What exactly they get, who it is for, and why now, in one sentence. The same product can fail on one offer and land on another.
3. **The price.** The number and the model (one-off, subscription, free tier). Change one of them per throw.
4. **The channel.** Where the people who have the problem find you. Give one channel enough throws to read a result before you switch.

One rule across all four: change one thing per throw, so you can tell which one moved the result.

## Credit

The dice-and-tray idea comes from @dr.fahimp's reel on Instagram: https://www.instagram.com/reel/Db5hdQOof9y/ . The film, the drawings, this table and these notes are Vektor's.
