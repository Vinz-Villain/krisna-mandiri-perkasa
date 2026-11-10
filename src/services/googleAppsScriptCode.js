/**
 * Kode Google Apps Script (v2.1) yang dapat langsung disalin dari Dashboard Admin
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ====================================================================
 * CV. KRISNA MANDIRI PERKASA - GOOGLE SHEETS DATABASE API (v2.1)
 * ====================================================================
 * Skrip Google Apps Script untuk menjadikan Google Spreadsheet sebagai
 * database cloud live untuk website katalog CV. Krisna Mandiri Perkasa.
 *
 * FITUR:
 * 1. Otomatis merapikan lebar kolom & text-wrap agar teks tidak menumpuk.
 * 2. Menampilkan THUMBNAIL FOTO PRODUK langsung di dalam sel Google Sheet (kolom previewFoto).
 * 3. Menghapus kolom WhatsApp yang redundan agar tabel lebih ringkas & bersih.
 * 4. Otomatis menyimpan foto upload baru ke folder Google Drive dan menghasilkan URL CDN.
 */

var SHEET_PRODUCTS = "Products";
var SHEET_CATEGORIES = "Categories";
var SHEET_BRANDS = "Brands";

var PRODUCT_HEADERS = [
  "id", "name", "category", "brand", "description", "sku",
  "summary", "image", "previewFoto", "specsBadge", "updatedAt"
];

var CATEGORY_HEADERS = ["id", "name", "icon", "description", "updatedAt"];
var BRAND_HEADERS = ["id", "name", "origin", "description", "updatedAt"];

function formatSheetColumns(sheet, sheetName, headers) {
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#DC2626");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);

  if (sheetName === SHEET_PRODUCTS) {
    var widths = {
      1: 170, 2: 230, 3: 160, 4: 130, 5: 320, 6: 150,
      7: 260, 8: 240, 9: 90, 10: 280, 11: 170
    };
    for (var col in widths) {
      sheet.setColumnWidth(Number(col), widths[col]);
    }
  } else if (sheetName === SHEET_CATEGORIES) {
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 220);
    sheet.setColumnWidth(3, 140);
    sheet.setColumnWidth(4, 320);
    sheet.setColumnWidth(5, 170);
  } else if (sheetName === SHEET_BRANDS) {
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 180);
    sheet.setColumnWidth(3, 150);
    sheet.setColumnWidth(4, 320);
    sheet.setColumnWidth(5, 170);
  }

  var maxRows = Math.max(sheet.getLastRow(), 2);
  var dataRange = sheet.getRange(1, 1, maxRows, headers.length);
  dataRange.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  dataRange.setVerticalAlignment("middle");
}

function getOrCreateSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    formatSheetColumns(sheet, sheetName, headers);
  } else {
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      formatSheetColumns(sheet, sheetName, headers);
    }
  }
  return sheet;
}

function sheetToObjects(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0] && !row[1]) continue;
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j];
      if (key === "previewFoto") continue;
      var val = row[j];
      if (typeof val === "string") {
        if (val.indexOf("{") === 0 || val.indexOf("[") === 0) {
          try { val = JSON.parse(val); } catch (e) {}
        }
      }
      obj[key] = val;
    }
    if (obj.image) {
      obj.images = [obj.image];
    }
    rows.push(obj);
  }
  return rows;
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getAll";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = { status: "success", action: action, timestamp: new Date().toISOString() };

  try {
    var pSheet = getOrCreateSheet(ss, SHEET_PRODUCTS, PRODUCT_HEADERS);
    var cSheet = getOrCreateSheet(ss, SHEET_CATEGORIES, CATEGORY_HEADERS);
    var bSheet = getOrCreateSheet(ss, SHEET_BRANDS, BRAND_HEADERS);

    if (action === "test") {
      result.message = "Koneksi Google Sheets API CV. Krisna Mandiri Perkasa Berhasil!";
      result.sheetTitle = ss.getName();
    } else if (action === "getProducts") {
      result.products = sheetToObjects(pSheet);
    } else if (action === "getCategories") {
      result.categories = sheetToObjects(cSheet);
    } else if (action === "getBrands") {
      result.brands = sheetToObjects(bSheet);
    } else {
      result.products = sheetToObjects(pSheet);
      result.categories = sheetToObjects(cSheet);
      result.brands = sheetToObjects(bSheet);
    }
  } catch (err) {
    result.status = "error";
    result.message = err.toString();
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = { status: "success", timestamp: new Date().toISOString() };

  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      body = e.parameter;
    }

    var action = body.action || "saveProduct";
    var pSheet = getOrCreateSheet(ss, SHEET_PRODUCTS, PRODUCT_HEADERS);
    var cSheet = getOrCreateSheet(ss, SHEET_CATEGORIES, CATEGORY_HEADERS);
    var bSheet = getOrCreateSheet(ss, SHEET_BRANDS, BRAND_HEADERS);

    if (action === "saveProduct") {
      var prod = body.product || body;
      if (!prod.id) prod.id = "PROD-" + new Date().getTime();
      prod.updatedAt = new Date().toISOString();

      if (prod.image && prod.image.indexOf("data:image") === 0) {
        prod.image = uploadBase64ToDrive(prod.image, "prod_" + prod.id);
      }

      upsertRow(pSheet, PRODUCT_HEADERS, prod.id, prod);
      result.product = prod;
      result.message = "Produk berhasil disimpan ke Google Sheet!";
    } else if (action === "deleteProduct") {
      var deleted = deleteRowById(pSheet, body.id);
      result.message = deleted ? "Produk berhasil dihapus dari Google Sheet!" : "Produk tidak ditemukan.";
    } else if (action === "saveCategory") {
      var cat = body.category || body;
      if (!cat.id) cat.id = "cat-" + new Date().getTime();
      cat.updatedAt = new Date().toISOString();
      upsertRow(cSheet, CATEGORY_HEADERS, cat.id, cat);
      result.category = cat;
      result.message = "Kategori berhasil disimpan ke Google Sheet!";
    } else if (action === "deleteCategory") {
      var deletedCat = deleteRowById(cSheet, body.id);
      result.message = deletedCat ? "Kategori berhasil dihapus dari Google Sheet!" : "Kategori tidak ditemukan.";
    } else if (action === "saveBrand") {
      var brand = body.brand || body;
      if (!brand.id) brand.id = "brand-" + new Date().getTime();
      brand.updatedAt = new Date().toISOString();
      upsertRow(bSheet, BRAND_HEADERS, brand.id, brand);
      result.brand = brand;
      result.message = "Merek berhasil disimpan ke Google Sheet!";
    } else if (action === "deleteBrand") {
      var deletedBrand = deleteRowById(bSheet, body.id);
      result.message = deletedBrand ? "Merek berhasil dihapus dari Google Sheet!" : "Merek tidak ditemukan.";
    } else if (action === "syncAll") {
      if (body.products && Array.isArray(body.products)) {
        clearSheetKeepHeader(pSheet, SHEET_PRODUCTS, PRODUCT_HEADERS);
        body.products.forEach(function(item) { upsertRow(pSheet, PRODUCT_HEADERS, item.id, item); });
        formatSheetColumns(pSheet, SHEET_PRODUCTS, PRODUCT_HEADERS);
      }
      if (body.categories && Array.isArray(body.categories)) {
        clearSheetKeepHeader(cSheet, SHEET_CATEGORIES, CATEGORY_HEADERS);
        body.categories.forEach(function(item) { upsertRow(cSheet, CATEGORY_HEADERS, item.id, item); });
        formatSheetColumns(cSheet, SHEET_CATEGORIES, CATEGORY_HEADERS);
      }
      if (body.brands && Array.isArray(body.brands)) {
        clearSheetKeepHeader(bSheet, SHEET_BRANDS, BRAND_HEADERS);
        body.brands.forEach(function(item) { upsertRow(bSheet, BRAND_HEADERS, item.id, item); });
        formatSheetColumns(bSheet, SHEET_BRANDS, BRAND_HEADERS);
      }
      result.message = "Seluruh katalog berhasil disinkronkan & dirapikan di Google Sheet!";
    } else {
      result.status = "error";
      result.message = "Aksi tidak dikenali: " + action;
    }
  } catch (err) {
    result.status = "error";
    result.message = err.toString();
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function upsertRow(sheet, headers, id, dataObj) {
  var values = sheet.getDataRange().getValues();
  var idIndex = headers.indexOf("id");
  var rowIndexToUpdate = -1;

  for (var i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(id)) {
      rowIndexToUpdate = i + 1;
      break;
    }
  }

  var targetRow = rowIndexToUpdate > 0 ? rowIndexToUpdate : (sheet.getLastRow() + 1);

  var rowData = headers.map(function(h) {
    if (h === "previewFoto") {
      var imageColLetter = "H";
      return '=IF(ISBLANK(' + imageColLetter + targetRow + '), "", IF(REGEXMATCH(TO_TEXT(' + imageColLetter + targetRow + '), "^https?://"), IMAGE(' + imageColLetter + targetRow + '), "Path File"))';
    }

    var val = dataObj[h];
    if (val === undefined || val === null) return "";
    if (typeof val === "object") return JSON.stringify(val);
    var str = String(val);

    if (str.length > 0 && str.charAt(0) === '=') {
      return "'" + str;
    }
    return str;
  });

  if (rowIndexToUpdate > 0) {
    sheet.getRange(rowIndexToUpdate, 1, 1, headers.length).setValues([rowData]);
    sheet.setRowHeight(rowIndexToUpdate, 65);
  } else {
    sheet.appendRow(rowData);
    var newRow = sheet.getLastRow();
    sheet.setRowHeight(newRow, 65);
  }

  sheet.getRange(targetRow, 1, 1, headers.length)
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)
    .setVerticalAlignment("middle");
}

function deleteRowById(sheet, id) {
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

function clearSheetKeepHeader(sheet, sheetName, headers) {
  sheet.clear();
  sheet.appendRow(headers);
  formatSheetColumns(sheet, sheetName, headers);
}

function uploadBase64ToDrive(base64Data, filename) {
  try {
    var folderName = "KMP_Katalog_Uploads";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var parts = base64Data.split(",");
    var contentType = parts[0].indexOf(":") > -1 ? parts[0].split(":")[1].split(";")[0] : "image/jpeg";
    var decoded = Utilities.base64Decode(parts[1]);
    var blob = Utilities.newBlob(decoded, contentType, filename + ".jpg");

    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return "https://lh3.googleusercontent.com/d/" + file.getId();
  } catch (e) {
    return base64Data;
  }
}`;
