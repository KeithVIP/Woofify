const apiKey = "2Qiy6zxPX4cqcreCD0PTgJywBchv2BDtG42IM7RwTW1PHG8g4w"; // assign our key to a variable, easier to read
const secret = "1yoCQGBhzKKchC2iWYeTfyRw32LiQexcCsahyGY1";
const tokenApi = "https://api.petfinder.com/v2/oauth2/token";

const bearerTokenKey = "woofifyToken";

// the next line and function set up the button in our html to be clickable and reactive 
document.addEventListener('DOMContentLoaded', bindButtons);

function retrieveToken(callback) {
	let sTokenFromLocalStorage = window.localStorage.getItem(bearerTokenKey);
	let currentTimeStamp = moment();
	if(!sTokenFromLocalStorage || currentTimeStamp.isSameOrAfter(JSON.parse(sTokenFromLocalStorage).validUntil)) {
		$.post(tokenApi, { grant_type: "client_credentials", client_id: apiKey, client_secret: secret }, function(data, status) {
			if(status === "success") {
				window.localStorage.setItem(bearerTokenKey, JSON.stringify({ token: data.access_token, validUntil: currentTimeStamp.add(data.expires_in, 'seconds') }));
				if(callback)
					callback(data.access_token);
			} else {
				// show error message
			}
		});
	} else {
		if(callback) 
			callback(JSON.parse(sTokenFromLocalStorage).token);
	}

}

function findDogsByZipCode(breed, zipCode, callbackSuccess) {
	retrieveToken(function(token) {
		$.ajax({
			url: "https://api.petfinder.com/v2/animals?type=dog&breed=" + breed + "&location=" + zipCode,
			beforeSend: function (xhr) {
				xhr.setRequestHeader ("Authorization", "Bearer " + token);
			},
			success: function (response) {
				if(callbackSuccess)
					callbackSuccess(response);
			}
		})
	})
}

//;

function bindButtons(){
    document.getElementById('submitZip').addEventListener('click', function(event){
        event.preventDefault();
        var zip = document.getElementById('zip').value; // this line gets the zip code from the form entry
		var breedElement = document.getElementById('dogBreed');
		var breed = breedElement.options[breedElement.selectedIndex].text;
		// empty the container
		let adoptionListElem = document.getElementById("adoption-list");
		adoptionListElem.innerHTML = "";
		findDogsByZipCode(breed, zip, function(response) {
			console.log(response); // debugging
			if(response && response.animals) {
				let dogs = response.animals;
				for(var i = 0; i < dogs.length; i++) {
					let dog = dogs[i];
					let dogName = dog.name;
					let dogAge = dog.age;
					let dogGender = dog.gender;
					let dogUrl = dog.url;
					var dogPhoto = "./assets/images/no-photo.png";
					if(dog.photos && dog.photos.length > 0) {
						dogPhoto = dog.photos[0].small;
					}
					var contactPhone = "No phone available";
					var contactAddress = "No address available";
					if(dog.contact) {
						contactPhone = dog.contact.phone;
						if(dog.contact.address) {
							let address = dog.contact.address;
							contactAddress = address.address1;
							if(address.address2) {
								contactAddress += " " + address.address2;
							}
							contactAddress += ", " + address.city;
							contactAddress += ", " + address.state;
							contactAddress += " - " + address.postCode;
						}
					}
					// build the card
					let adoptionCard = document.createElement("div");  // <div id="dog-5532424" class="col-md-2 adoption"> </div>
					adoptionCard.setAttribute("id", "dog-" + dog.id);
					adoptionCard.setAttribute("class", "col-md-2 adoption");
					
					let adoptionCardName = document.createElement("p");   // <p class="adoption-name">Bobby</p>
					adoptionCardName.setAttribute("class", "adoption-card-name");
					adoptionCardName.textContent = dogName;

					let adoptionCardAge = document.createElement("p");   // <p class="adoption-age">Young</p>
					adoptionCardAge.setAttribute("class", "adoption-card-age");
					adoptionCardAge.textContent = dogAge;

					let adoptionCardImage = document.createElement("img");  // <img src="..." alt="Bobby's picture" class="adoption-card-photo"></img>
					adoptionCardImage.setAttribute("class", "adoption-card-photo");
					adoptionCardImage.setAttribute("src", dogPhoto);
					adoptionCardImage.setAttribute("alt", dog.name + "'s picture");

					adoptionCard.appendChild(adoptionCardName); // <div id="dog-5532424" class="col-md-2 adoption"><p class="adoption-name">Bobby</p></div>
					adoptionCard.appendChild(adoptionCardAge); // <div id="dog-5532424" class="col-md-2 adoption"><p class="adoption-name">Bobby</p><p class="adoption-age">Young</p></div>
					adoptionCard.appendChild(adoptionCardImage); // <div id="dog-5532424" class="col-md-2 adoption"><p class="adoption-name">Bobby</p><p class="adoption-age">Young</p><img src="..." alt="Bobby's picture" class="adoption-card-photo"></img></div>


					// append the card to the container
					adoptionListElem.appendChild(adoptionCard);
				}
			}
		});

    });

}

document.addEventListener('DOMContentLoaded', bindButtons);