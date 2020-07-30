class Users {
  constructor() {
    this.people = [];
  }

  addPerson(id, name, room) {
    let person = { id, name, room };
    this.people.push(person);
    return this.people;
  }

  getPerson(id) {
    let person = this.people.filter(p => p.id === id)[0];

    return person;
  }

  getPeople() {
    return this.people;
  }

  getPeopleByRoom(room) {
    let peopleInRoom = this.people.filter(p => p.room === room);
    return peopleInRoom;
  }

  removePerson(id) {
    let personRemoved = this.getPerson(id);
    this.people = this.people.filter(p => p.id !== id);

    return personRemoved;
  }
}

module.exports = {
  Users,
};
