export class appState {

    entries = $state([]);

    addEntry = () => {
        this.entries.push()
    }
}

export type Entry = {
    text: string,
    
}