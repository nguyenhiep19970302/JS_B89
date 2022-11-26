var dsnv = new DanhSachNhanVien();
getLocal();

var vaLiDaTion = new VaLiDaTion();

function getEle(id) {
    return document.getElementById(id);
};

function layThongTinNV(ADDorUPDATA) {
    var taiKhoan = getEle("tknv").value;
    var hoVaTen = getEle("name").value;
    var eMail = getEle("email").value;
    var matKhau = getEle("password").value;
    var ngayLam = getEle("datepicker").value;
    var luongCoBan = getEle("luongCB").value;
    var chucVu = getEle("chucvu").value;
    var gioLam = getEle("gioLam").value;

    var isValid = true;
    if (ADDorUPDATA) {
        isValid &= vaLiDaTion.kyTu(taiKhoan, "errorStaffID", "(*) Vui lòng nhập 4-6 ký tự", 4, 6)
            && vaLiDaTion.trungNV(taiKhoan, "errorStaffID", "(*) Mã tài khoản bị trùng", dsnv.arr);
    };

    isValid &= vaLiDaTion.checkSpace(hoVaTen, "errorName", "(*) Không để tên trống")
        && vaLiDaTion.checkName(hoVaTen, "errorName", "(*) Tên không được có ký tự đặc biệt ");

    isValid &= vaLiDaTion.checkSpace(eMail, "errorEmail", "(*) Không để email trống")
        && vaLiDaTion.checkEmail(eMail, "errorEmail", "(*) Nhập đúng định dạng Mail");

    isValid &= vaLiDaTion.checkSpace(matKhau, "errorPassWord", "(*) không để mật khẩu trống")
        && vaLiDaTion.checkPassword(matKhau, "errorPassWord", "(*) Mật khẩu (Chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt)");

    isValid &= vaLiDaTion.checkSpace(ngayLam, "errorDayWord", "(*) Không để ngày bắt đầu trống")&&vaLiDaTion.checkDayMothYear(ngayLam,"errorDayWord","(*) Vui lòng nhập đúng định dạng mm/yyyy")

    isValid &= vaLiDaTion.checkSpace(luongCoBan, "errorBasicSalary", "(*) Không Để Lương Trống")
        && vaLiDaTion.checkLuong(luongCoBan, "errorBasicSalary", "(*) Lương Cơ Bản 1 000 000 - 20 000 000", 1000000, 20000000);

    isValid&=vaLiDaTion.checkNV("chucvu","errorPosition","(*) Chọn chức vụ của bạn")

    isValid&=vaLiDaTion.checkSpace(gioLam,"errorTimeWork","(*) Không để giờ làm trống")
    &&vaLiDaTion.checkTimeWork(gioLam,"errorTimeWork","(*) Số giờ làm trong tháng 80 - 200 giờ",80,200)
    if (!isValid) { return };

    var nv = new NhanVien(taiKhoan, hoVaTen, eMail, matKhau, ngayLam, luongCoBan, chucVu, gioLam);
    return nv;
};

getEle("btnThemNV").onclick = function () {
    var nv = layThongTinNV(true);
    console.log(nv)
    if (nv) {
        dsnv.themNV(nv);
        nv.tinhTongLuong();
        nv.tinhXepHang();
        renderTable(dsnv.arr);
        setLocal();
    };
};

function renderTable(data) {
    var result = "";
    for (var i = 0; i < data.length; i++) {
        var nv = data[i];
        result += `
        <tr>
        <td>${nv.taiKhoan}</td>
        <td>${nv.hoVaTen}</td>
        <td>${nv.eMail}</td>
        <td>${nv.ngayLam}</td>
        <td>${nv.chucVu}</td>
        <td>${nv.tongLuong}</td>
        <td>${nv.xepHang}</td>
        <td>
        <button data-target="#myModal" data-toggle="modal" class="btn btn-info" onclick="editNV('${nv.taiKhoan}')">Cập Nhật</button><br>
        <button class="btn btn-danger" onclick="deleteNV('${nv.taiKhoan}')">Delete</button></td>
        </tr>
        `
    };
    return getEle("tableDanhSach").innerHTML = result;
};

function setLocal() {
    var setLocalStorage = JSON.stringify(dsnv.arr);
    localStorage.setItem("DSNV", setLocalStorage);
};

function getLocal() {
    if (localStorage.getItem("DSNV")) {
        var getLocalStorage = localStorage.getItem("DSNV");
        dsnv.arr = JSON.parse(getLocalStorage);
        return renderTable(dsnv.arr);
    };
};

function deleteNV(taiKhoan) {
    dsnv.xoaNV(taiKhoan);
    renderTable(dsnv.arr);
    setLocal();
};

function editNV(taiKhoan) {
    var nv = dsnv.capNhatNV(taiKhoan);
    getEle("tknv").value = nv.taiKhoan;
    getEle("tknv").disabled = true;
    getEle("name").value = nv.hoVaTen;
    getEle("email").value = nv.eMail;
    getEle("password").value = nv.matKhau;
    getEle("datepicker").value = nv.ngayLam;
    getEle("luongCB").value = nv.luongCoBan;
    getEle("chucvu").value = nv.chucVu;
    getEle("gioLam").value = nv.gioLam;
    getEle("btnThemNV").style.display="none"
    getEle("btnCapNhat").style.display = "inline-block";
    getEle("header-title").innerHTML="Cập Nhật"
};

getEle("btnCapNhat").onclick = function () {
    var nv = layThongTinNV(false);
    dsnv.capNhatDSNV(nv);
    nv.tinhTongLuong();
    nv.tinhXepHang();
    renderTable(dsnv.arr);
    setLocal();

    clearData();
};


getEle("btnDong").onclick = function () {
    clearData();
};
// function handleEscClearData(key) {
//     if (key == '27') {
//         clearData();
//     }
// }

function clearData(){
    getEle("nhanVienFrom").reset();
};


getEle("searchName").addEventListener("keyup", function () {
    var keyword = getEle("searchName").value;
    var arrXepHang = dsnv.timKiemXepHang(keyword);
    renderTable(arrXepHang);
  });