export function formatCurrency(amount : number) {
    return new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP',  minimumFractionDigits: 0}).format(amount)
}

export function formatDate (dateStr: string) : string {
    const dateObj = new Date(dateStr)
    const options : Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return new Intl.DateTimeFormat('es-CO', options).format(dateObj)
}