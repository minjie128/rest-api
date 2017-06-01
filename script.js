"use strict";

var movieData = [];

// Add Movie
$("#addMovie").click(function() {
  displayForm();
});

// Cancel Form
$("#cancelForm").click(function() {
  displayTable();
});

// Submit Form
$("#movie-form").submit(function() {
  event.preventDefault();
  movieData.push({
    title: $("#movieTitle").val(),
    director: $("#movieDirector").val(),
    genre: $("#movieGenre").val(),
    country: $("#movieCountry").val(),
    year: $("#movieYear").val(),
    runtime: $("#movieRuntime").val()
  });
  createMovie(movieData);
  updateMovie(movieData);
  displayTable();
  displayMovieData();
  $("input, select").val("");
});

function displayMovieData() {
  $("#movie-table-tbody").empty();
  var tr, td, button;
  for (var i = 0; i < movieData.length; i++) {
    tr = $("<tr>");

    td = $("<td>");
    td.text(movieData[i].title);
    tr.append(td);

    td = $("<td>");
    td.text(movieData[i].director);
    tr.append(td);

    td = $("<td>");
    td.text(movieData[i].genre);
    tr.append(td);

    td = $("<td>");
    td.text(movieData[i].country);
    tr.append(td);

    td = $("<td>");
    td.text(movieData[i].year);
    tr.append(td);

    td = $("<td>");
    td.text(movieData[i].runtime);
    tr.append(td);

    td = $("<td>");
    button = $("<button type='button' class='editBtn'>");
    button.text("Edit");
    td.append(button);
    button = $("<button type='button' class='deleteBtn'>");
    button.text("Delete");
    td.append(button);
    tr.append(td);

    $("#movie-table-tbody").append(tr);
  }
  // Delete Movie
  $(".deleteBtn").click(function() {
    $(this).parents("tr").remove();
    var deleteId = $(this).parents().siblings(":first").text();
    movieData = movieData.filter(function(el) {
      return el.title !== deleteId;
    });
    deleteMovie(movieData);
  });
  // Edit Movie
  $(".editBtn").click(function() {
    var editId = $(this).parents().siblings(":first").text();
    var movieToEdit = $.grep(movieData, function(el) {
      return el.title === editId;
    })[0];
    displayForm();
    $("#movieTitle").val(movieToEdit.title);
    $("#movieDirector").val(movieToEdit.director);
    $("#movieGenre").val(movieToEdit.genre);
    $("#movieCountry").val(movieToEdit.country);
    $("#movieYear").val(movieToEdit.year);
    $("#movieRuntime").val(movieToEdit.runtime);
    movieData = movieData.filter(function(el) {
      return el.title !== editId;
    });
  });
}

// Display Table
function displayTable() {
  $("#movie-form").hide();
  $("#movie-table").show();
}
// Display Form
function displayForm() {
  $("#movie-table").hide();
  $("#movie-form").show();
}

// Use the REST API to store the data
var BASE_URL = 'https://pacific-meadow-64112.herokuapp.com/data-api/';
var collection = 'jmin';

getListOfMoives();

function reportResponse(response) {
  console.log(JSON.stringify(response, null, 4));
}

function reportAjaxError(jqXHR, textStatus, errorThrown) {
  var msg = 'AJAX error.\n' +
    'Status Code: ' + jqXHR.status + '\n' +
    'Status: ' + textStatus;
  if (errorThrown) {
    msg += '\n' + 'Error thrown: ' + errorThrown;
  }
  if (jqXHR.responseText) {
    msg += '\n' + 'Response text: ' + jqXHR.responseText;
  }
  console.log(msg);
}

function createMovie(movieData) {
  $.ajax(BASE_URL + collection,
  {
    method: 'POST',
    data: movieData,
    success: reportResponse,
    error: reportAjaxError
  });
}

function getListOfMoives() {
  $.ajax(BASE_URL + collection,
  {
    method: 'GET',
    success: function(response) {
      movieData = response;
      displayMovieData();
    },
    error: reportAjaxError
  });
}

function updateMovie(movie) {
  var movie = {
    title: movieData.title,
    director: movieData.director,
    genre: movieData.genre,
    country: movieData.country,
    year: movieData.year,
    runtime: movieData.runtime
  };
  $.ajax(BASE_URL + collection + '/' + movie.title,
  {
    method: 'PUT',
    data: movieData,
    succes: reportResponse,
    error: reportAjaxError
  });
}

function deleteMovie(movieData) {
  $.ajax(BASE_URL + collection + '/' + movieData.title,
  {
    method: 'DELETE',
    success: reportResponse,
    error: reportAjaxError
  });
}
