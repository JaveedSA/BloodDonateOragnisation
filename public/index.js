var stateObject = {
  "India": {
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],

    "Tamil Nadu": ["Chennai", "Chengalpattu", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Kallakurichi", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Perambalur",
      "Pudukkottai", "Ramanathapuram", "Salem", "Sivagangai", "Thanjavur", "Nilgiris", "Theni", "Thoothukudi", "Tiruchirapalli", "Tirunelveli", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar", "Ariyalur",
      "Tirupur"
    ]
  },

}
window.onload = function() {
  var countySel = document.getElementById("countySel"),
    stateSel = document.getElementById("stateSel"),
    districtSel = document.getElementById("districtSel");
  for (var country in stateObject) {
    countySel.options[countySel.options.length] = new Option(country, country);
  }
  countySel.onchange = function() {
    stateSel.length = 1; // remove all options bar first
    districtSel.length = 1; // remove all options bar first
    if (this.selectedIndex < 1) return; // done
    for (var state in stateObject[this.value]) {
      stateSel.options[stateSel.options.length] = new Option(state, state);
    }
  }
  countySel.onchange(); // reset in case page is reloaded
  stateSel.onchange = function() {
    districtSel.length = 1; // remove all options bar first
    if (this.selectedIndex < 1) return; // done
    var district = stateObject[countySel.value][this.value];
    for (var i = 0; i < district.length; i++) {
      districtSel.options[districtSel.options.length] = new Option(district[i], district[i]);
    }
  }
}

document.querySelector('.div2').addEventListener('click', function(e) {
  window.location.href = '/bloodtypes';
}, false);

document.querySelector('.div3').addEventListener('click', function(e) {
  window.location.href = '/benifits';
}, false);



// ......................start.................
$(window).scroll(function() {
    if ($(this).scrollTop()>10)
     {
        $('.div1').hide(1000);
     }
    else
     {
      $('.div1').show(1000);
     }
 });
