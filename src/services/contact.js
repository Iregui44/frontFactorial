const url = 'http://localhost:3000/contactos';

export function getContacts() {
    return fetch(url).then((response) => {
        return response.json();
    });
}

export function postContact(name, lastname, email, phone) {
    return new Promise((resolve, reject) => fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: name, apellido: lastname, email: email, celular: phone })
    }).then((response) => {
        console.log(response);
        return resolve(response.json());
    })
        .catch(error => {
            console.log(error);
            return reject(error)
        })
    )
}

export function deleteContact(email) {
    return new Promise((resolve, reject) => fetch(url+`/${email}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then((response) => {
        console.log(response);
        return resolve(response.json());
    })
        .catch(error => {
            console.log(error);
            return reject(error)
        })
    )
}

export function updateContact(name, lastname, email, phone) {
    return new Promise((resolve, reject) => fetch(url+`/${email}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: name, apellido: lastname, celular: phone })
    }).then((response) => {
        console.log(response);
        return resolve(response.json());
    })
        .catch(error => {
            console.log(error);
            return reject(error)
        })
    )
}