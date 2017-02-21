var person = {
    name: 'Andrew',
    age: 21
};


function updatePerson(obj){
    // obj = {
    //     name: 'Andrew',
    //     age: 24
    // };

    obj.age = 24;
}

updatePerson(person);
console.log(person);



//array example
var grades = [23, 43, 55];

function addGrades(gradesArr){
    grades.push(66);
    debugger;

    //when javascript calls the function it creates the gradesArr object and that is what gets updated
    //gradesArr = [12, 33, 99];
}


addGrades(grades);
console.log(grades);