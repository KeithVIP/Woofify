var apiKey = "2Qiy6zxPX4cqcreCD0PTgJywBchv2BDtG42IM7RwTW1PHG8g4w"; // assign our key to a variable, easier to read

// the next line and function set up the button in our html to be clickable and reactive 
document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
	document.getElementById('submitZip').addEventListener('click', function(event){
		event.preventDefault();
		var zip = document.getElementById('zip').value; // this line gets the zip code from the form entry
		var url = "https://api.petfinder.com/v2/pet.getRandom" + apiKey;
		
		// Within $.ajax{...} is where we fill out our query 
		$.ajax({
			url: url,
			jsonp: "callback",
			dataType: "json",
			data: {
				key: apiKey,
				animal: 'dog',
				'location': zip,
				output: 'basic',
				format: 'json'
			},
			// Here is where we handle the response we got back from Petfinder
			success: function( response ) {
				console.log(response); // debugging
				var dogName = response.petfinder.pet.name.$t;
				var img = response.petfinder.pet.media.photos.photo[0].$t;
				var id = response.petfinder.pet.id.$t;

				var newName = document.createElement('a');
				var newDiv = document.createElement('div');
				newName.textContent = Name;
				newName.href = "https://www.petfinder.com/v2/petdetail/" + id + apiKey;

				var newImg = document.createElement('img');
				newImg.src = img;
				
				var list = document.createElement("div");
				list.setAttribute("id", "List");
				document.body.appendChild(list);

				newDiv.appendChild(newName);
				list.appendChild(newDiv);
				list.appendChild(newImg);
			}
		});
		})

}

document.addEventListener('DOMContentLoaded', bindButtons);