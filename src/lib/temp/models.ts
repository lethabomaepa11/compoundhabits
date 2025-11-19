
export class User {
    userId: string;
    email: string;
    fname: string;
    lname: string;

    constructor(userId: string, email: string, fname: string, lname: string) {
        this.userId = userId;
        this.email = email;
        this.fname = fname;
        this.lname = lname;
    }
    
}
export class HabitSystem {
    id: string;
    name: string;
    userId: string;
    description?: string;
    keywords: string;
    category: string

    constructor(id: string, name: string, userId: string, keywords: string, category: string, description?: string,) {
        this.id = id;
        this.name = name;
        this.userId = userId;
        this.description = description;
        this.keywords = keywords;
        this.category = category
    }
}


export class Habit {
    id: string;
    metadata: string;
    systemId: string;
    keywords: string;

    constructor(id: string, systemId: string, metadata: string, keywords: string) {
        this.id = id;
        this.metadata = metadata;
        this.systemId = systemId;
        this.keywords = keywords
    }
}

export class Activity {
    id: string;
    habitId: string;
    createdAt: string;
    text: string;


    constructor(id: string, habitId: string, createdAt: string, text: string) {
        this.id = id;
        this.habitId = habitId;
        this.createdAt = createdAt;
        this.text = text;
    }
}