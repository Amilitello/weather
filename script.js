$(document).ready(function(){
    var APIKey = "166a433c57516f51dfab1f7edaed8413";

    var history = JSON.parse(localStorage.getItem("history"))||[]

    $("#searchbutton").on("click",function(){
        var inputbutton= $("#search").val()
        $("#search").val("")
        //call search weather function
        getweather(inputbutton)
        get5day(inputbutton)
    })

    $(".history").on("click", "li", function(){
      getweather($(this).text())
    })



    function makeButton(inputbutton){
      var li= $("<li>").addClass("list-group-item list-group-item-action").text(inputbutton)
      $(".history").append(li)
    }

    function getweather(inputbutton){
        

        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
          "q="+inputbutton+"&appid=" + APIKey+"&units=imperial";
    
        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response){
            console.log(response)
            if(history.indexOf(inputbutton)=== -1){
              history.push(inputbutton)
              localStorage.setItem("history", JSON.stringify(history))
              makeButton(inputbutton)
            }
            $("#today").empty()
            var temp= $("<p>").text(response.main.temp)
            var humidity= $("<p>").text(response.main.humidity)
            var wind= $("<p>").text(response.wind.speed)
            var img= $("<img>").attr("src","http://openweathermap.org/img/w/"+response.weather[0].icon+".png")
            var name= $("<h2>").text(response.name)
            var lat= response.coord.lat
            var lon= response.coord.lon
            $("#today").append(img,name,temp,humidity,wind)
            uvIndex(lat,lon)
        })
    }

    function uvIndex(lat, lon){ 
      $.ajax({
      url: "http://api.openweathermap.org/data/2.5/uvi?appid="+APIKey+"&lat=" + lat + "&lon=" + lon,
      method: "GET"
    }).then(function(response){
      var uvi= $("<p>").text("uvIndex: ")
      var button= $("<span>").addClass("btn btn-sm").text(response.value)
      if(response.value<3){
        button.addClass("btn-success")
      }
      else if(response.value<7){
        button.addClass("btn-warning")
      }
      else{
        button.addClass("btn-danger")
      }
      $("#today").append(uvi.append(button))
    })
    }


    function get5day(inputbutton){
        

        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?" +
          "q="+inputbutton+"&appid=" + APIKey+"&units=imperial";
    
        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response){
        console.log(response)
        $("#5day").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

        for(i=0;i<response.list.length;i++){
            if(response.list[i].dt_txt.indexOf("15:00:00")!==-1){
                var card= $("<div>").addClass("card bg-primary text-white")
                var col= $("<div>").addClass("col-md-2")
                var body= $("<div>").addClass("card-body p-2")
                var title= $("<h3>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString())
                var img= $("<img>").attr("src","http://openweathermap.org/img/w/"+response.list[i].weather[0].icon+".png")
                var maxTemp= $("<p>").addClass("card-text").text(response.list[i].main.temp_max)
                var humidity= $("<p>").addClass("card-text").text(response.list[i].main.humidity)
                col.append(card.append(body.append(title, img, maxTemp, humidity)))
                $("#5day .row").append(col)
                //look in object and see how to get temp and humidity
            }
        }
        }  
        )
    }
})