export function CompareDates(a, b) {
    if (a.release_date && b.release_date) 
    {
        // both a and b has release_dates
        const a_date = new Date(a.release_date)
        const b_date = new Date(b.release_date)

        if (a_date < b_date) { 
            return 1; 
        } else if (a_date > b_date) {
            return -1; 
        }
        return 0;
        
    } else if (a.release_date) {
        // only a has release date
        return -1
    } else if (b.release_date) {
        // only b has release date
        return 1
    } else {
        // both are missing release dates
        const a_title = a.title ? a.title : a.name
        const b_title = b.title ? b.title : b.name

        if (a_title < b_title) { 
            return -1; 
        } else if (a_title > b_title) {
            return 1; 
        }
        return 0;
    }
}