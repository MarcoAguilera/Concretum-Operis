function clickImgs() {
    var imgs = document.getElementsByClassName('gallery__img');
    for(i = 0; i < imgs.length; i++) {
        imgs[i].addEventListener('click', function() {
            showPopUp(this.id); 
        });
    }
}

clickImgs();

$('.popup').on('click', function(event) {
    if (event.target.id == "popup") {
        hidePopUp();
    }
});

$('.carousel-item__container-title').on('click', function(event) {
    showDesc();
});

window.onresize = setImgDim;

function setImgDim() {
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    var imgs = document.getElementsByClassName("carousel__img");

    for(i of imgs) {
        if (i.width > i.height) {
            if (width > height) {
                i.style.height = "inherit";
                i.style.width = "";
            }
            else {
                i.style.width = "inherit";
                i.style.height = "";
            }
        }
        else {
            if (width > height) {
                i.style.height = "inherit";
                i.style.width = "";
            }
            else {
                i.style.width = "inherit";
                i.style.height = "";
            }
        }
    }
}

function showPopUp(id) {

    setImgDim();

    var img = "#carousel" + id;
    $(".carousel-item").removeClass('active');
    $(img).addClass("active");
    document.getElementById('popup').style.opacity = "1";
    document.getElementById('popup').style.visibility = "visible";

    $("body").css('overflow-y', 'hidden');
}

function hidePopUp() {
    document.getElementById('popup').style.opacity = "0";
    document.getElementById('popup').style.visibility = "hidden";
    $(".carousel-item").removeClass('active');
    $("body").css('overflow-y', 'visible');
}

function showDesc() {

    if ($('.carousel-item__container-desc').css('opacity') == 0) {
        $('.carousel-item__container-desc').show(300);
        $('.carousel-item__container-desc').fadeTo(300, 1);
    }
    else if ($('.carousel-item__container-desc').css('opacity') == 1) {
        $('.carousel-item__container-desc').hide(300);
        $('.carousel-item__container-desc').fadeTo(300, 0);
    }
}

$('.service__card--btn').on('click', function(event) {
    $('.contact-popup').show(300);
});

$('.contact-popup__close').on('click', function(event) {
    $('.contact-popup').hide(300);
})

$('.request-popup__remove').on('click', function(event) {
    $('.request-popup').width("0rem");
    $("html").css('overflow', 'visible');
});

$('.in_bounds').on('click', function(event) {
    $('.request-popup__content').empty();
    $("html").css('overflow', 'hidden');
    
    var day = event.currentTarget.firstChild.data;
    var nodes = event.currentTarget.childNodes[1].childNodes;

    $('.request-popup__date-day').html(day);
    
    for(i = 0; i < nodes.length; i++) {
        var div = [];
        if(nodes[i].nodeType == 1) {
            for(j = 0; j < nodes[i].childNodes.length; j++) {
                if(nodes[i].childNodes[j].nodeType == 1) {
                    div.push(nodes[i].childNodes[j].textContent);
                }
            }
        
            $('.request-popup__content')
            .append(`<form id=${div[0]} class="request-popup__content__card-form">
            <div class="request-popup__content__card">
            <h2 class="request-popup__content__card-name">${div[1]}</h2>
            <div class="request-popup__content__card__sec">
                <img class="request-popup__content__card-img" src="/img/email.svg">
                <h4 class="request-popup__content__card-email">${div[2]}</h4>
            </div>
            <div class="request-popup__content__card__sec">
                <img class="request-popup__content__card-img" src="/img/phone.svg">
                <h4 class="request-popup__content__card-phone">${div[3]}</h4>
            </div>
            <div class="request-popup__content__card__sec flex">
                <img class="request-popup__content__card-img" src="/img/msg.svg">
                <div class="request-popup__content__card-msg">${div[4]}</div>
            </div>
            <button class="request-popup__content__card-remove" type="submit">&#10008;</button>
            </div></form>`);
        }
    }

    $('.request-popup__content__card-form').on('submit', function(e) {
        e.preventDefault();
      
        $.ajax ({
            url: '/request',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({id: e.target.id, day: day}),
            success: function(response) {
                console.log(response);

                console.log("Readjust");
                console.log(event.currentTarget.childNodes[1]);
                while (event.currentTarget.childNodes[1].firstChild) {
                    event.currentTarget.childNodes[1].removeChild(event.currentTarget.childNodes[1].firstChild);
                }

                console.log(event.currentTarget.childNodes[1]);
                for(i = 0; i < response.length; i++) {
                    if(i < 3) {
                        $(event.currentTarget.childNodes[1]).
                        append(`<div class="calander__card__apps__app-${i + 1}">${response[i].customer[0]}<label class="request-data">${response[i]._id}</label>
                        <label class="request-data">${response[i].customer}</label>
                        <label class="request-data">${response[i].email}</label>
                        <label class="request-data">${response[i].phone}</label>
                        <label class="request-data">${response[i].message}</label>
                        </div>`);
                    }
                    else if(i == 3) {
                        $(event.currentTarget.childNodes[1]).
                        append(`<div class="calander__card__apps__app-${i + 1}">${response.length - 3}+<label class="request-data">${response[i]._id}</label>
                        <label class="request-data">${response[i].customer}</label>
                        <label class="request-data">${response[i].email}</label>
                        <label class="request-data">${response[i].phone}</label>
                        <label class="request-data">${response[i].message}</label>
                        </div>`);
                    }
                    else {
                        $(event.currentTarget.childNodes[1]).
                        append(`<div class="calander__card__apps__app-over">${response[i].customer[0]}<label class="request-data">${response[i]._id}</label>
                        <label class="request-data">${response[i].customer}</label>
                        <label class="request-data">${response[i].email}</label>
                        <label class="request-data">${response[i].phone}</label>
                        <label class="request-data">${response[i].message}</label>
                        </div>`);
                    }
                }

                event.currentTarget.click();
            }
        })
    });
    $('.request-popup').width("40rem");
}); 