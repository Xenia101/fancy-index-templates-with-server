// config.js


// Add class
window.onload = function() {
    $('#list').addClass('table is-striped is-fullwidth mb-5');
    $('#search').addClass('input is-info mt-3 mb-3 is-small');
}


// Add input form for search
var form = document.createElement('form');
var input = document.createElement('input');

input.name = 'filter';
input.id = 'search';
input.placeholder = 'Type to search';

form.appendChild(input);

document.querySelector('h1').after(form);

var listItems = [].slice.call(document.querySelectorAll('#list tbody tr'));

input.addEventListener('keyup', function () {
    var i,
    e = "(^|.*[^\\pL])" + this.value.trim().split(/\s+/).join("([^\\pL]|[^\\pL].*[^\\pL])") + ".*$",
    n = RegExp(e, "i");
    listItems.forEach(function(item) {
        item.removeAttribute('hidden');
    });
    listItems.filter(function(item) {
        i = item.querySelector('td').textContent.replace(/\s+/g, " ");
        return !n.test(i);
    }).forEach(function(item) {
        item.hidden = true;
    });
});


// Add icon to dir file 
$('td a').each(function(){
    // go-back link icon
    if ($(this).text().indexOf("Parent directory") >= 0) {
		var oldText = $(this).text();
		$(this).html('<i class="fas fa-undo mr-2"></i> ' + oldText);
		return;
	}

    if ($(this).attr('href').substr($(this).attr('href').length - 1) == '/') { // directory (folder)
		var oldText = $(this).text();
		$(this).html('<i class="far fa-folder-open mr-2"></i> ' + oldText.substring(0, oldText.length - 1));
		return;
    } else { // file
        var oldText = $(this).text();
        $(this).html('<i class="fas fa-save mr-2"></i> ' + oldText);
        return;
    }
});


// modal
class BulmaModal {
	constructor(selector) {
		this.elem = document.querySelector(selector)
		this.close_data()
	}
	
	show() {
		this.elem.classList.toggle('is-active')
		this.on_show()
	}
	
	close() {
		this.elem.classList.toggle('is-active')
		this.on_close()
	}
	
	close_data() {
		var modalClose = this.elem.querySelectorAll("[data-bulma-modal='close'], .modal-background")
		var that = this
		modalClose.forEach(function(e) {
			e.addEventListener("click", function() {
				
				that.elem.classList.toggle('is-active')

				var event = new Event('modal:close')

				that.elem.dispatchEvent(event);
			})
		})
	}
	
	on_show() {
		var event = new Event('modal:show')

        this.elem.dispatchEvent(event);
	}
	
	on_close() {
		var event = new Event('modal:close')
	
		this.elem.dispatchEvent(event);
	}
	
	addEventListener(event, callback) {
		this.elem.addEventListener(event, callback)
	}
}

var btn = document.querySelector("#btn")
var mdl = new BulmaModal("#myModal")

btn.addEventListener("click", function () {
	mdl.show()
})

mdl.addEventListener('modal:show', function() {})
mdl.addEventListener("modal:close", function() {})


// file drag and drop
$(document).ready(function () {
    Dropzone.autoDiscover = false;
    $("#upload-zone").dropzone({
        url: "http://10.0.17.231:3000/upload?dst=" + window.location.pathname,
        addRemoveLinks: true,
        dictRemoveFile: '삭제',
        previewTemplate: document.getElementById('template-preview').innerHTML,
        success: function (file, response) {
            //file.previewElement.classList.add("dz-success");
            file.previewElement.classList.add("has-text-success");
            window.location.reload();
        },
        error: function (file, response) {
            //file.previewElement.classList.add("dz-error");
            file.previewElement.classList.add("has-text-danger");
        }
    });
});


// right mouse click event - menu
function mouseX(evt) {
    if (evt.pageX) {
        return evt.pageX;
    } else if (evt.clientX) {
        return evt.clientX + (document.documentElement.scrollLeft ?
            document.documentElement.scrollLeft :
            document.body.scrollLeft);
    } else {
        return null;
    }
}

function mouseY(evt) {
    if (evt.pageY) {
        return evt.pageY;
    } else if (evt.clientY) {
        return evt.clientY + (document.documentElement.scrollTop ?
            document.documentElement.scrollTop :
            document.body.scrollTop);
    } else {
        return null;
    }
}

var active_flag = true;
var remove_click_element;

$(document).on("contextmenu", "td a", function(event){
    if (active_flag && $(this).attr('title')) {        
        event.preventDefault();
    
        remove_click_element = $(this);
    
        document.getElementById("rmenu").className = "rm-show";
        document.getElementById("rmenu").style.top = mouseY(event) + 'px';
        document.getElementById("rmenu").style.left = mouseX(event) + 'px';
    
        window.event.returnValue = false;
    
        return false;
    }
});

$(document).bind("click", function(event) {
    document.getElementById("rmenu").className = "rm-hide";
});

// remove action
$('#remove').bind('click', function() {
    var base_path = window.location.pathname;
    var filename  = remove_click_element.attr('title');

    var q = base_path + filename;
    $.ajax({
        url: 'http://10.0.17.231:3000/delete?rm=' + q,
        success: function(data) {
            if (data.status) {
                window.location.reload();
            } else {
                alert('디렉토리는 삭제할 수 없습니다.');
            }
        }
    })
});

var title_name;
// rename file name
$('#rename').bind('click', function(e) {
    active_flag = false;
    e.preventDefault();

    title_name = remove_click_element.attr('title');

    if ($('input .rename-input').length === 0) {
        remove_click_element.replaceWith(
            `
            <div class="field has-addons" id="rename-frame">
                <div class="control">
                    <input id='rname' class="rename-input input is-success is-small" type="text" placeholder="` + remove_click_element.attr('title') + `">
                </div>
                <div class="control">
                    <a class="button is-success is-small rename-check" onclick="rename_fn()">
                        <i class="fas fa-check"></i>
                    </a>
                </div>
                <div class="control">
                    <a class="button is-danger is-small rename-cancel" onclick="rename_cancel()">
                        <i class="fas fa-times"></i>
                    </a>
                </div>
            </div>
            `
        );
        $('#rname').val(title_name);
        $('#rname').focus();
    }
});

function rename_fn() {
    var base_path = window.location.pathname;
    var org_fn = base_path + title_name;
    var new_fn = $('.rename-input').val()
    $.ajax({
        url: 'http://10.0.17.231:3000/rename?org=' + org_fn + '&new=' + new_fn + '&base=' + base_path,
        success: function(data) {
            if (data.status) {
                window.location.reload();
            } else {
                console.log('err');
            }
        }
    })
}

function rename_cancel() {         
    $('#rename-frame').replaceWith(
        `
        <a href="`+title_name+`" title="`+title_name+`"><i class="fas fa-save mr-2"></i> `+title_name+`</a>
        `
    );
    window.location.reload();
}


// file name copy
$('#fn-copy').bind("click", function(event) {
    clipboard_text = remove_click_element.attr('title');

    $('#clipboard_target').val(clipboard_text);
    $('#clipboard_target').select();
    document.execCommand("copy");

    quickNotice('클립보드로 복사가 완료되었습니다!');
});

function quickNotice(message,cssClass,timeOnScreen)
{
    cssClass = (cssClass) ? cssClass : 'is-success';
    timeOnScreen = (timeOnScreen) ? timeOnScreen : 1000;
    
    var html = '<div id="quickNotice" style="position: fixed; z-index: 100; width: 100%; opacity:.8;" class="notification has-text-centered has-text-weight-semibold '+cssClass+'">';
        html+= message;
        html+= '</div>';
    
    $('body').append(html);
    var notice = $("#quickNotice"),
        startPosition = (notice.innerHeight()) * -1;
        notice.css({'top':startPosition+'px'});
        notice.animate({top:0},300);
        setTimeout(function(){
            notice.animate({top:startPosition+'px'},500,function(){
                notice.remove();    
            });
        },timeOnScreen);
}

// animation css
