interface Observer { //the event listener
    onNotify(event:Event): void;
}

class Subject { //the event caller

    ObserverList: Array<Observer> = new Array<Observer>();

    public addObserver(observer: Observer): void {
        this.ObserverList.push(observer);
    }

    public removeObserver(observer: Observer): void {
        this.ObserverList.splice(this.ObserverList.indexOf(observer), 1);
    }

    protected notify(event: Event): void {
        this.ObserverList.forEach(observer => {
            observer.onNotify(event);
        });
    }
}

