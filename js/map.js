let current_KH = { lat: 22.7416777, lng: 120.3515305 }; 
let marker;
let markers = [];
let map;
let infowindow;
let keyword;

// ajax 
function getData(data) {

    $.ajax({
        url: 'http://work1999.kcg.gov.tw/open1999/ServiceRequestsQuery.asmx/ServiceRequestsQuery',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('ajax is loading data....');
            setMarker(data);
            console.log(data);
        },
        error: function(error) {
            console.log('Error:' + ' ' + error);
        }
    });
}

// Map 
function initMap() {

    console.log('初始化地圖中....');

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: current_KH,
        mapTypeId: google.maps.MapTypeId.ROADMAP,

        // Map control. change position to zoom in and out.
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOCENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        fullscreenControl: false
    });

}

function setMarker(data) {

    keyword = document.getElementById('selectpicker').value;

    console.log('已選:' + ' ' + keyword); // 取得user所select的區域

    set_Marker_data(data, marker);

}

// 每一次select，地圖會更新並載入新區域的資料
function set_Marker_data(data, marker) {

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];

    for (var i = 0, len = data.length; i < len; i++) {

        // 1999
        let zipcode = data[i].zipcode_; 
        let name = data[i].ZipName_;
        let address = data[i].address_;
        let status = data[i].StatusName_; 
        let unit = data[i].UnitName_; 
        let description = data[i].InformDesc_; 
        let dateTime = data[i].Cre_Date_; 
        let lat = data[i].Lat_; 
        let lng = data[i].Lng_;

        if (keyword === name) {
            map.setZoom(12);

            marker = new google.maps.Marker({
                map: map,
                // position 屬性可設定標記的位置
                position: {
                    lat: Number(lat), 
                    lng: Number(lng)
                },      

            });

            markers.push(marker); 
            console.log('地區:' + zipcode + name + ' ' + description + ' ' + '負責單位:' + unit + ' ' + '經緯度:' + lat + ' ' + lng + name); // 它把所有在1999(json)中的區 都console.log出來

            // infowindow content
            let content= '<b>區域:</b>' + ' '+ name + '</br>' + '<b>負責單位:</b>' + ' '+ unit + '</br>' + '<b>案件名稱:</b>' + ' '+ description + '</br>' + '<b>案件狀態:</b>' + ' '+ status + '<br>';
            attachMessage(marker,content);
        }
    }
    
    console.log(keyword + '設定完成!!');
}

// infowindow
function attachMessage(marker,content) {

    var infowindow = new google.maps.InfoWindow({
        content: content,
    });
    marker.addListener('mousemove',function(){
        infowindow.open(marker.get('map'),marker);
    });
    marker.addListener('mouseout',function(){
        infowindow.close(marker.get('map'),marker);
    });

    console.log('attach messages.');

}
initMap();
