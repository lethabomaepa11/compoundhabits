

//general user class
export class User {
    id: string;
    email: string;
    fname: string;
    lname: string;

    constructor(id: string, email: string, fname: string, lname: string) {
        this.id = id;
        this.email = email;
        this.fname = fname;
        this.lname = lname;
    }
    
}

//mail user class, used when sending emails
export class MailUser{
    email: string;
    name: string;

    constructor(email: string, name: string){
        this.email = email;
        this.name = name;
    }
}

export class Mail {
    subject: string;
    textPart: string
    htmlPart: string

    constructor(subject: string, textPart: string, htmlPart: string) {
        this.subject = subject;
        this.textPart = textPart;
        this.htmlPart = htmlPart;
    }
}

//habit system class
export class HabitSystem {
    id: string;
    name: string;
    user_id: string;
    description?: string;
    category: string

    constructor(id: string, name: string, userId: string, category: string, description?: string,) {
        this.id = id;
        this.name = name;
        this.user_id = userId;
        this.description = description;
        this.category = category
    }
}


//habit class
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


//activity class 
export class Activity {
    id: string;
    createdAt: string;
    text: string;


    constructor(id: string, createdAt: string, text: string) {
        this.id = id;
        this.createdAt = createdAt;
        this.text = text;
    }
}

//database activity class
export class DBActivity extends Activity {
    habitId: string;


    constructor(id: string, habitId: string, createdAt: string, text: string) {
        super(id, createdAt, text);
        this.habitId = habitId;
    }
}