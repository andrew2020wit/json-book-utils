export interface ISrtItem {
    time: string;
    text: string;
    index: string;
}

export function parseSrt(srtText: string): ISrtItem[] {
    const srtLines = srtText.split('\n')
        .map(x => x.replaceAll('\r', '')
            .trim()
        )

    const result: ISrtItem[] = [];

    let currentText = '';
    let currentTime = '';
    let srtIndex = '';

    for (let i = 0; i < srtLines.length; i++) {
        const srtLine = srtLines[i];

        if (!srtLine) {
            // start of the new srt block

            // save previous srt block
            if (srtIndex) {
                result.push({
                    time: currentTime,
                    text: currentText,
                    index: srtIndex,
                })
            }

            currentText = '';
            currentTime = '';
            srtIndex = '';

            continue;
        }

        if (!srtIndex) {
            srtIndex = srtLine;
            continue;
        }

        if (!currentTime) {
            currentTime = srtLine;
            continue;
        }

        currentText += ' ' + srtLine;
    }

    // save the last srt block
    result.push({
        time: currentTime,
        text: currentText,
        index: srtIndex,
    })

    return result;
}

