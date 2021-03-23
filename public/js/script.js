const handleSubmitSurvey = () => {
    const config = {
            apiKey: "AIzaSyDQBUs3YMBVXOQTVq4C68EKLwl0NkU6RmE",
            authDomain: "book-recs-1580a.firebaseapp.com",
            databaseURL: "https://book-recs-1580a-default-rtdb.firebaseio.com",
            projectId: "book-recs-1580a",
            storageBucket: "book-recs-1580a.appspot.com",
            messagingSenderId: "842740101788",
            appId: "1:842740101788:web:4ef31653c803f124863359",
            measurementId: "G-843YS38J6C"
        };
    
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    else {
        firebase.app(); // if already initialized, use that one
    }

    const genre = getGenre();
    const series = getSeriesPref();
    const emotion = getEmotion();
    let shuffledBooks;
    // Get books from DB
    const getBookRec = firebase.database().ref('books');
    getBookRec.on('value', (snapshot) => {
        const allBooks = snapshot.val();
        const allBooksArray = Object.entries(allBooks);

        // Filter books based on survey results
        const allRecommendations = allBooksArray.filter(book => {
            // book[0] is the title of the book, book[1] is all of the data associated with it
            const bookData = book[1];
            const bookGenre = bookData.genre;
            const bookEmotion = bookData.emotions;

            // Firebase RTBD does not support booleans, converts all text to strings
            const seriesBoolToStr = bookData.series.toString();
            return seriesBoolToStr === series && bookGenre.includes(genre) && bookEmotion.includes(emotion);
        });
        shuffledBooks = shuffleBookRecs(allRecommendations);
        const bookRecommendation = shuffledBooks[0][1];
        document.getElementById('coverImg').setAttribute('src', bookRecommendation.cover_img);
        return shuffledBooks;  
    }).then(shuffledBooks => {
        console.log('BOOKS', shuffledBooks)  
    })  
}

const getGenre = () => {
    const genre = document.getElementById('genre').value;
    return genre;
}

const getSeriesPref = () => {
    const seriesSelection = document.getElementsByName('series');
    let series;

    for (let i = 0; i < seriesSelection.length; i++) {
        if (seriesSelection[i].checked) {
            series = seriesSelection[i].value;
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    return series;
}

const getEmotion = () => {
    const emotion = document.getElementById('emotion').value;
    return emotion;   
}

const shuffleBookRecs = (books) => {
    let shuffledBooks = [];
    for(let i = books.length; i > 0; i--) {
        const randomNum = Math.random() 
        const randomFloat = randomNum * books.length         
        const randomIdx = Math.floor(randomFloat)
        shuffledBooks.push(books[randomIdx])
        books.splice(randomIdx, 1)
    }
    console.log(shuffledBooks)
    return shuffledBooks;
}
