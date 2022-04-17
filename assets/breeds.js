var breeds;

$('#breed_search').on('input', function(e) {
  var search_str = $(this).val();
  searchBreeds(search_str)
});

function searchBreeds(search_str) {
  var string_length = search_str.length 
  search_str = search_str.toLowerCase(); 
  for (var i = 0; i < breeds.length; i++) 
  {
    var breed_name_snippet = breeds[i].name.substr(0, string_length).toLowerCase(); 
    if (breed_name_snippet == search_str) {
      getDogByBreed(breeds[i].id) 
      return; 
    }
  }
}

var $breed_select = $('select.breed_select');
$breed_select.change(function() {
  var id = $(this).children(":selected").attr("id");
  getDogByBreed(id)
});


function getBreeds() {
  ajax_get('https://api.thedogapi.com/v1/breeds', function(data) {
    populateBreedsSelect(data)
    breeds = data
  });
}
function populateBreedsSelect(breeds) {
  $breed_select.empty().append(function() {
    var output = '';
    $.each(breeds, function(key, value) {
      output += '<option id="' + value.id + '">' + value.name + '</option>';
    });
    return output;
  });
}

function getDogByBreed(breed_id) {
  
  ajax_get('https://api.thedogapi.com/v1/images/search?include_breed=1&breed_id=' + breed_id, function(data) {

    if (data.length == 0) {
      
      clearBreed();
      $("#breed_data_table").append("<tr><td>Sorry, no Image for that breed yet</td></tr>");
    } else {
      
      displayBreed(data[0])
    }
  });
}
function clearBreed() {
  $('#breed_image').attr('src', "");
  $("#breed_data_table tr").remove();
}
function displayBreed(image) {
  $('#breed_image').attr('src', image.url);
  $("#breed_data_table tr").remove();

  
  var breed_data = image.breeds[0];

  if(breed_data) {
    let breedHeight = breed_data.height.metric + " cm";
    let breedWeight = breed_data.weight.metric + " kg";
    let breedTemperament = breed_data.temperament;
    let breedName = breed_data.name;
    let breedLifeSpan = breed_data.life_span;
    let breedOrigin = breed_data.origin;
    $("#breed_data_table").append("<tr><td>Name: </td><td>" + breedName + "</td></tr>");
    $("#breed_data_table").append("<tr><td>Height: </td><td>" + breedHeight + "</td></tr>");
    $("#breed_data_table").append("<tr><td>Weight: </td><td>" + breedWeight + "</td></tr>");
    $("#breed_data_table").append("<tr><td>Temperament: </td><td>" + breedTemperament + "</td></tr>");
    $("#breed_data_table").append("<tr><td>Life Span: </td><td>" + breedLifeSpan + "</td></tr>");
    $("#breed_data_table").append("<tr><td>Origin: </td><td>" + breedOrigin + "</td></tr>");
  } else {
    $("#breed_data_table").append("<tr><td>Sorry, no data for that breed yet</td></tr>");
  }
}

function ajax_get(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log('responseText:' + xmlhttp.responseText);
      try {
        var data = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + " in " + xmlhttp.responseText);
        return;
      }
      callback(data);
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}
getBreeds();