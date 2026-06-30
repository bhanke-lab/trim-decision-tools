// @ts-nocheck
// Office Script. Runs in Excel where ExcelScript is a global runtime namespace. 
// It is not compiled by a local TypeScript server, so type checking is turned off 
// for this file. Paste the body into Excel (Automate->New Script) to run it.

function main(workbook: ExcelScript.Workbook) {
    type ScalarFill = { range: string; value: number | string }
    type ResetTarget = {
        live: string
        backup: string
        clearRanges: string[]
        restoreRanges: string[]
        scalarFills: ScalarFill[]
    }

    const targets: ResetTarget[] = [
        {
            live: "Value Table",
            backup: "_Formulas_Backup",
            clearRanges: [],
            restoreRanges: ["A7:K30"],
            scalarFills: [],
        },
        {
            live: "Lengths Value Table",
            backup: "_LengthsBackup",
            clearRanges: ["A7:A30", "B7:H30", "J7:K30", "M7:T30"],
            restoreRanges: ["A7:A30", "B7:H30", "J7:K30", "M7:T30"],
            scalarFills: [{ range: "W2:X5", value: 1 }],
        },
        {
            live: "Lengths Value Table (Manual)",
            backup: "_ManualBackup",
            clearRanges: ["A7:A30", "B7:H30", "J7:K30"],
            restoreRanges: ["A7:A30", "B7:H30", "J7:K30", "M7:T28"],
            scalarFills: [],
        },
    ]

    const summary: string[] = []

    for (const t of targets) {
        const live = workbook.getWorksheet(t.live)
        const backup = workbook.getWorksheet(t.backup)
        if (!live) { summary.push(`SKIP ${t.live}: live sheet missing`); continue }
        if (!backup) { summary.push(`SKIP ${t.live}: backup ${t.backup} missing`); continue }

        for (const addr of t.clearRanges) {
            live.getRange(addr).clear(ExcelScript.ClearApplyTo.contents)
        }

        let restored = 0
        for (const addr of t.restoreRanges) {
            const liveRange = live.getRange(addr)
            const backupRange = backup.getRange(addr)
            const bf = backupRange.getFormulas()
            const top = liveRange.getRowIndex()
            const left = liveRange.getColumnIndex()
            const lf = liveRange.getFormulas()
            for (let r = 0; r < bf.length; r++) {
                for (let c = 0; c < bf[r].length; c++) {
                    const f = bf[r][c]
                    if (typeof f === "string" && f.startsWith("=") && lf[r][c] !== f) {
                        live.getCell(top + r, left + c).setFormula(f)
                        restored++
                    }
                }
            }
        }

        for (const s of t.scalarFills) {
            live.getRange(s.range).setValue(s.value)
        }

        summary.push(`${t.live}: restored ${restored} formula cell(s)`)
    }

    console.log(summary.join("\n"))
}