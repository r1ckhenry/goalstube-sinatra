// Add videos to the page
function appendNewVideo(vid) {
  var videoCard = '<figcacption class="figcaption"><div class="fig-header">' + vid.name + '</div><figure>';
      videoCard += '<iframe width="292" height="219" src="' + vid.url + '" frameborder="0" allowfullscreen></iframe>';
      videoCard += '</figure><div class="vid-details"><span>Details</span><p>' + vid.details + '</p>';
      videoCard += '<button id="editVid" data-id="' + vid.id + '"><i class="fa fa-pencil"></i></button>';
      videoCard += '<button id="displayBig" data-id="' + vid.id + '"><i class="fa fa-expand"></i></button>';
      videoCard += '<button id="deleteVid" data-id="' + vid.id + '"><i class="fa fa-trash"></i></button></div></figcacption>';
  $('#videos').prepend(videoCard);
}

// Get the existing items from the server
function getItems() {
  $.ajax({
    type: 'GET',
    url: '/videos',
    dataType: 'json'
  }).done(function(data){
    $.each(data, function(index, item){
      appendNewVideo(item)
    });
  })
}

function getAddNewVid() {
  $('#addVideoForm').show();
}

function submitVideo(e) {
  e.preventDefault();
  var vidName = $('#name').val();
  var vidDetails = $('#details').val();
  var vidUrl = $('#url').val();
  var vidGenre = $('#genre').val();
  $.ajax({
    type: 'POST',
    url: '/videos',
    dataType: 'json',
    data: { name: vidName,
            details: vidDetails,
            url: vidUrl,
            genre: vidGenre }
  }).done(function(data) {
    appendNewVideo(data);
    $('#addVideoForm').children().val('');
  })
}

function displayBigView(e) {
  var $this = $(this);
  var currUrl = $(this).prev().find('iframe').attr('src');
}

function goToEdit(e) {
  var videoId = $(this).data('id');
  $.ajax({
    type: 'GET',
    url: 'videos/' + videoId,
    dataType: 'JSON'
  }).done(function(data){
    $('#editVideoForm #name').val(data.name)
    $('#editVideoForm #details').val(data.details)
    $('#editVideoForm #genre').val(data.genre)
  })
}

function editVid(e) {
  e.preventDefault();
  var videoId = $(this).data('id');
  var newName = $('#editVideoForm #name').val();
  var newDetails = $('#editVideoForm #details').val();
  var newGenre = $('#editVideoForm #genre').val();
  $.ajax({
    type: 'PUT',
    url: '/videos/' + videoId,
    data: { name: newName,
          details: newDetails,
          genre: newGenre },
    dataType: 'JSON'
  }).done(function(data){
    console.log(data)
  });
}


$(document).ready(function(){
  getItems();
  $('#addVideo').on('click', getAddNewVid)
  $('#addVideoForm').on('submit', submitVideo)
  $('#videos').on('click', '#displayBig', displayBigView)
  $('#videos').on('click', '#editVid', goToEdit)
  $('#editVideoForm').on('submit', editVid)
});

