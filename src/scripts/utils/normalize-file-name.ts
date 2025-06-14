export function normalizeFileName(name: string): string {
    return name.toLowerCase()
        .replaceAll('  ', '-')
        .replaceAll('\t', '-')
        .replaceAll(' ', '-')
        .replaceAll(',', '')
        .replaceAll('!', '')
        .replaceAll('?', '')
        .replaceAll('"', '')
        .replaceAll('`', '')
        .replaceAll(`'`, '')
        .replaceAll(':', '-')
        .replaceAll('.', '')
        .replaceAll('---', '-')
        .replaceAll('--', '-');
}