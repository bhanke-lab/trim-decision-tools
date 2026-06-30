// The live loader, with the source path genericized to a relative AllProducts.xml. 
// The one non-negotiable step is forcing the thick column to type text, or fractions 
// like 4/4 read as dates and every lookup returns blank. This query outputs columns A to R. 
// Species (S) and minimum width (T), which the formulas read, are not in the XML and get '
// added separately on the RawData sheet, with the formulas in formulas.md.

let
    // Point this at your AllProducts.xml export. A relative path keeps it off any one machine.
    Source = Xml.Tables(File.Contents("AllProducts.xml")),
    Table0 = Source{0}[Table],
    // CRITICAL: thick stays text, or 4/4 and the like read as dates and every lookup goes blank.
    #"Changed Type" = Table.TransformColumnTypes(Table0,{{"instanceId", Int64.Type}, {"historicalId", Int64.Type}, {"name", type text}, {"thick", type text}, {"width", type text}, {"length", type text}, {"grade", type text}, {"price", type number}, {"volumePrice", Int64.Type}, {"edgerCorrectionFactor", Int64.Type}, {"resawCorrectionFactor", Int64.Type}, {"sideBySideCorrectionFactor", Int64.Type}, {"edgerAndResawCorrectionFactor", Int64.Type}, {"cutIn2CorrectionFactor", Int64.Type}, {"bow", Int64.Type}, {"crook", Int64.Type}, {"twist", Int64.Type}, {"priority", Int64.Type}})
in
    #"Changed Type"