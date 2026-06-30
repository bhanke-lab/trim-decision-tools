# Value Table formulas

Inputs (yellow cells): B1 thickness, B2 species, B3 width. All three tabs read
the same RawData sheet and share these inputs.

## Anchor spill formulas (Lengths Value Table)

### A7 - grade list, sorted by highest $/MBF

Pulls the unique grades that exist for the chosen thickness and species, scores
each by average $/MBF, sorts high to low. This is the only spill on the original
tab too.

    =IFERROR(LET(g,UNIQUE(FILTER(RawData!$G:$G,(RawData!$D:$D=$B$1)*(RawData!$S:$S=$B$2))),p,BYROW(g,LAMBDA(x,AVERAGEIFS(RawData!$I:$I,RawData!$D:$D,$B$1,RawData!$S:$S,$B$2,RawData!$G:$G,x))),SORTBY(g,p,-1)),"")

### J7 - $/MBF per grade

    =BYROW(A7#,LAMBDA(g,IFERROR(AVERAGEIFS(RawData!$I:$I,RawData!$D:$D,$B$1,RawData!$S:$S,$B$2,RawData!$G:$G,g),"")))

### K7 - minimum width per grade (gate; narrower boards show a dash)

    =BYROW(A7#,LAMBDA(g,IFERROR(MAXIFS(RawData!$T:$T,RawData!$D:$D,$B$1,RawData!$S:$S,$B$2,RawData!$G:$G,g),0)))

### B7 - per-board value grid, with zones and levers

    =IFERROR(IF($B$3<K7#,"-",J7#*BYCOL($B$6:$H$6,LAMBDA(L,INDEX($W$2:$X$5,SUMPRODUCT(($N$2:$N$5<=L)*($O$2:$O$5>=L)*$M$2:$M$5),IF(ISEVEN(L),1,2))))/1000*$B$4*$B$3*$B$6:$H$6/12),"")

### B4 - thickness decimal (auto, from Helpers)

    =IFERROR(INDEX(Helpers!$D:$D,MATCH($B$1,Helpers!$A:$A,0)),"")

## Original Value Table (simple, per-row formulas)

Only A7 is dynamic. J, K, and the grid are plain per-row formulas so anyone can
overtype a cell to test a number, then hit RESET.

### J7:J30 - $/MBF (first match)

    =IFERROR(INDEX(RawData!$I:$I,MATCH(1,(RawData!$G:$G=$A7)*(RawData!$D:$D=$B$1)*(RawData!$S:$S=$B$2),0)),"")

### K7:K30 - minimum width (first match)

    =IFERROR(INDEX(RawData!$T:$T,MATCH(1,(RawData!$G:$G=$A7)*(RawData!$D:$D=$B$1)*(RawData!$S:$S=$B$2),0)),"")

### B7:H30 - per-board value, plain arithmetic, no zones

    =IF(AND($A7<>"",$J7<>""),IF($B$3>=$K7,$J7/1000*($B$4*$B$3*B$6)/12,"-"),"")

## Even/odd zone lever system (Lengths tab)

- Zone bands in M:O (rows 2-5): M = zone number, N = min length, O = max length.
  No gaps, no overlaps; every length in B6:H6 falls in exactly one zone.
- Levers in W:X (rows 2-5): W = even multiplier, X = odd multiplier. 1.0 = no
  change; 0.80 = worth 80% of straight value.
- Each length L finds its zone with
  SUMPRODUCT(($N$2:$N$5<=L)*($O$2:$O$5>=L)*$M$2:$M$5), then IF(ISEVEN(L),1,2)
  picks the even or odd column.

## Should You Trim This Board (decision helper, Lengths tab)

    J38  leave long      =IFERROR(INDEX($B$7#,MATCH($J$33,$A$7#,0),MATCH($J$35,$B$6:$H$6,0)),"")
    J39  upgrades        =IFERROR(INDEX($B$7#,MATCH($J$34,$A$7#,0),MATCH($J$36,$B$6:$H$6,0)),"")
    J40  no upgrade      =IFERROR(INDEX($B$7#,MATCH($J$33,$A$7#,0),MATCH($J$36,$B$6:$H$6,0)),"")
    J44  expected if trim=IFERROR($J$41*$J$39+(1-$J$41)*$J$40,"")
    J45  edge ($)        =IFERROR($J$44-$J$38,"")
    J46  edge (%)        =IFERROR($J$45/$J$38,"")
    J47  verdict         =IF(OR(NOT(ISNUMBER($J$38)),NOT(ISNUMBER($J$39)),NOT(ISNUMBER($J$40))),"Pick grades and lengths",IF($J$46>=$J$42,"TRIM",IF($J$45>0,"MARGINAL","LEAVE LONG")))

J41 (chance it upgrades) and J42 (win margin required) are percent-formatted, so
50% is stored as 0.5. If you switch them to plain numbers, add /100 back into J44
and J47.

## RawData derived columns (S species, T minimum width)

The query loads columns A to R. Two more are added on the RawData sheet and filled
down from the first data row, since neither is in the XML.

Species, column S, read from the name in column C:

    =INDEX(Helpers!$B$2:$B$11,MATCH(TRUE,ISNUMBER(SEARCH(" "&Helpers!$B$2:$B$11,UPPER(" "&C2&" "))),0))

Returns whichever species code from the Helpers list (B2:B11) shows up as a whole
token in the name. The spaces around the term make it match " TUL" instead of a stray
substring. On older Excel enter it with Ctrl+Shift+Enter; modern Excel spills it.

Minimum width, column T, read from the width token in column E:

    =IF(E2="RandomW",0,IF(ISNUMBER(SEARCH("> 10 1/2",E2)),10.5,IF(ISNUMBER(SEARCH("> 5 1/2",E2)),5.5,IF(ISNUMBER(SEARCH("> 4 3/4",E2)),4.75,IF(ISNUMBER(SEARCH("> 8",E2)),8,IF(ISNUMBER(SEARCH("> 6",E2)),6,IF(ISNUMBER(SEARCH("> 5",E2)),5,IF(ISNUMBER(SEARCH("Rw SEL",E2)),4,IF(ISNUMBER(SEARCH("RO SEL",E2)),4,IF(ISNUMBER(SEARCH("Rw 5",E2)),5,IF(ISNUMBER(SEARCH("Rw 6",E2)),6,IF(ISNUMBER(SEARCH("Rw 4",E2)),4.5,0))))))))))))

RandomW means no minimum, so it returns 0. The specific tokens ("> 10 1/2", "> 5 1/2",
"> 4 3/4") are tested before the short ones ("> 8", "> 6", "> 5"), or a short match
would grab the wrong token. Add to the cascade if a new width token shows up in the
export.
