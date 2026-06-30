# Sim Comparison formulas

Two sets of dropdowns drive it: C12 and C13 feed the dollar-value block,
B34 and B35 feed the length blocks. Replace the runs
with your own; all figures here are synthetic.

## Layout

- Grade totals: A2:K8. Run names across B2:K2, grades down A3:A7, board feet in
  B3:K7, column totals in row 8.
- Length mix: A20:H30. Lengths across B20:H20, run names down A21:A30, percent of a
  run's output at each length in B21:H27. Each row sums to 100.

## Grade total for a run, by name

    =INDEX($B$8:$K$8, MATCH($C$12, $B$2:$K$2, 0))

Row 8 holds each run's grand total. MATCH finds the run column from its header.

## Value block, dollar impact of A vs B (rows 12-18)

Per grade (D12:D16 list the grades), the board-foot difference between the two
chosen runs:

    E12 =INDEX($B$3:$K$7,MATCH(D12,$A$3:$A$7,0),MATCH($C$12,$B$2:$K$2,0))
        -INDEX($B$3:$K$7,MATCH(D12,$A$3:$A$7,0),MATCH($C$13,$B$2:$K$2,0))

F12:F16 are the GTP values you type, the dollars per thousand board feet of moving
that grade. The dollar impact and the total swing:

    G12 =E12*F12/1000
    G18 =SUM(G12:G16)

## Length compare (rows 33-41)

OG percent at a length, then Sim A and Sim B (B34 and B35 are the dropdowns):

    D34 =INDEX($B$21:$H$30,MATCH("OG",$A$21:$A$30,0),MATCH(C34,$B$20:$H$20,0))
    E34 =INDEX($B$21:$H$30,MATCH($B$34,$A$21:$A$30,0),MATCH(C34,$B$20:$H$20,0))
    H34 =INDEX($B$21:$H$30,MATCH($B$35,$A$21:$A$30,0),MATCH(C34,$B$20:$H$20,0))

Differences and percent changes:

    F34 =E34-D34       Sim A minus OG, in points
    G34 =F34/D34       percent change, A vs OG
    I34 =H34-D34       Sim B minus OG, in points
    J34 =I34/D34       percent change, B vs OG
    K34 =E34-H34       Sim A minus Sim B, in points
    L34 =K34/H34       percent change, A vs B

## Total board feet helpers (L46:L48)

    L46 =$B$8                                          OG total
    L47 =INDEX($B$8:$K$8,MATCH($B$34,$B$2:$K$2,0))     Sim A total
    L48 =INDEX($B$8:$K$8,MATCH($B$35,$B$2:$K$2,0))     Sim B total

Percentages get converted to board feet against each run's own total, which is why
these helpers exist.

## Odd-length reduction (rows 44-48)

For each odd length (A45:A47 = 7, 9, 11), pull the points from the length compare,
then convert to board feet against the totals:

    B45 =INDEX($F$34:$F$40,MATCH(A45,$C$34:$C$40,0))    Sim A points vs OG
    E45 =INDEX($I$34:$I$40,MATCH(A45,$C$34:$C$40,0))    Sim B points vs OG

    D45 =(INDEX($E$34:$E$40,MATCH(A45,$C$34:$C$40,0))/100)*$L$47
        -(INDEX($D$34:$D$40,MATCH(A45,$C$34:$C$40,0))/100)*$L$46    Sim A bf change
    G45 =(INDEX($H$34:$H$40,MATCH(A45,$C$34:$C$40,0))/100)*$L$48
        -(INDEX($D$34:$D$40,MATCH(A45,$C$34:$C$40,0))/100)*$L$46    Sim B bf change

    C45 =D45/((INDEX($D$34:$D$40,MATCH(A45,$C$34:$C$40,0))/100)*$L$46)    Sim A change as percent of OG
    F45 =G45/((INDEX($D$34:$D$40,MATCH(A45,$C$34:$C$40,0))/100)*$L$46)    Sim B same

    H45 =D45-G45                      A minus B, in board feet
    I45 =IF($G45<$D45,$B$35,$B$34)    names whichever cut more

Row 48 sums each column for the odd-length total.

## Top reduction (rows 51-52)

The single biggest odd-length cut for each run:

    I51 =INDEX($A$45:$A$47,MATCH(MIN($D$45:$D$47),$D$45:$D$47,0))    length
    J51 =INDEX($B$45:$B$47,MATCH(MIN($D$45:$D$47),$D$45:$D$47,0))    points
    K51 =INDEX($C$45:$C$47,MATCH(MIN($D$45:$D$47),$D$45:$D$47,0))    percent
    L51 =MIN($D$45:$D$47)                                           board feet

Row 52 is the same against Sim B's column G. A negative board-foot change is the
goal, since it means the run moved output off odd lengths toward even ones.
