// ============================================================
//  Modz X Cheat  —  V50  (Server Menu + AOS Login + Combat)
//  MCPE 0.15.10 + Toolbox 3.2.8 + Rhino Java 2016
// ============================================================

// === IMPORTS ===
var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var Button            = android.widget.Button;
var EditText          = android.widget.EditText;
var LinearLayout      = android.widget.LinearLayout;
var PopupWindow       = android.widget.PopupWindow;
var ScrollView        = android.widget.ScrollView;
var TextView          = android.widget.TextView;
var Toast             = android.widget.Toast;
var Runnable          = java.lang.Runnable;
var Thread            = java.lang.Thread;
var View              = android.view.View;
var ColorDrawable     = android.graphics.drawable.ColorDrawable;
var GradientDrawable  = android.graphics.drawable.GradientDrawable;
var Color             = android.graphics.Color;
var Gravity           = android.view.Gravity;
var Intent            = android.content.Intent;
var Uri               = android.net.Uri;
var Animation         = android.view.animation.Animation;
var ScaleAnimation    = android.view.animation.ScaleAnimation;
var BufferedReader    = java.io.BufferedReader;
var InputStreamReader = java.io.InputStreamReader;
var URL               = java.net.URL;
var URLEncoder        = java.net.URLEncoder;

// === PALETA ===
var C = {
    BG_PANEL:   "#F010101A",
    BG_CARD:    "#FF14141F",
    BG_CARD2:   "#FF1A1A2A",
    ACCENT:     "#FF8B6CFF",
    ACCENT2:    "#FF5CDFFF",
    LINE:       "#FF20203A",
    TEXT_MAIN:  "#FFF0F0FF",
    TEXT_SOFT:  "#FF8A8AA0",
    TEXT_DIM:   "#FF50506A",
    OFF:        "#FF2A2A3E",
    DANGER:     "#FFFF4C6A",
    SUCCESS:    "#FF4CF57A",
    WARN:       "#FFFFB84C",
    BACK_BG:    "#FF121220"
};

// === SESION PROPORCIONADA POR EL LOADER ===
// No se vuelve a solicitar la key aquí; el loader define estos valores.
if (typeof SERVER_URL === "undefined") SERVER_URL = "http://78.154.103.40:13143";
if (typeof AUTH_TOKEN === "undefined") AUTH_TOKEN = "";
if (typeof AUTH_USER === "undefined") AUTH_USER = "";
if (typeof AUTH_PLAN === "undefined") AUTH_PLAN = "";
if (typeof AUTH_EXPIRE === "undefined") AUTH_EXPIRE = "";
if (typeof AUTH_STATUS === "undefined") AUTH_STATUS = "Offline";
if (typeof AUTH_FORCED === "undefined") AUTH_FORCED = false;
if (typeof AUTH_KEY === "undefined") AUTH_KEY = "";
var BANNED_NOTIFIED = false;

// ============================================================
//  ESTADO GLOBAL
// ============================================================
var nightVisionOn   = false;
var playerDetectOn  = false;
var espOverlayOn    = false;
var findChestOn     = false;
var findHopperOn    = false;
var antiJakOn       = false;
var flyOn           = false;
var godModeOn       = false;
var noFallOn        = false;
var distFloatOn     = false;
var distFloatTarget = null;
var autoSpawnOn     = false;
var autoKillOn      = false;
var autoSpawnArmed  = true;
var autoKillArmed   = true;

// COMBATE
var killAuraOn      = false;
var killAuraRange   = 4.0;
var autoAttackOn    = false;
var autoAttackRange = 3.0;
var autoAttackDelay = 8;
var fastHitOn       = false;
var fastHitCPS      = 12;
var stealthKillOn   = false;

// HITBOX
var hitboxOn        = false;
var hitboxSize      = 1.1;

// ANTI-ANTI-JAK
var slowWalkOn      = false;
var maxVelocity     = 0.35;

var detectTick      = 0;
var chestScanTick   = 0;
var hopperScanTick  = 0;
var jakCheckTick    = 0;
var autoAttackTick  = 0;

var chestFound      = [];
var hopperFound     = [];

// ESP overlay
var espOverlayView  = null;

// Distance float overlay
var distFloatView   = null;

// Player list snapshot
var playerSnapshot  = [];

// Handles de popups
var GUI, menu, menu1, menu2, menu3, menu4, menu5, menu6, menu7, menu8, menu9;
var loginDialog = null;
var fabX = -1;
var fabY = dip(28);

// SELECTOR
var selectedPlayer       = null;
var selectedPlayerName   = "";
var tipDistOn            = false;
var tipCoordsOn          = false;
var tipDistTick          = 0;
var tipCoordsTick        = 0;
var menuSelectorRef      = [null];
var menuPlayerRef        = [null];
var menuPlayerActionsRef = [null];

// ============================================================
//  UTILIDADES
// ============================================================
function dip(dp) {
    return Math.ceil(dp * ctx.getResources().getDisplayMetrics().density);
}

function makeRoundedBg(fillHex, strokeHex, radius) {
    var d = new GradientDrawable();
    d.setColor(Color.parseColor(fillHex));
    if (strokeHex) d.setStroke(dip(1), Color.parseColor(strokeHex));
    d.setCornerRadius(dip(radius !== undefined ? radius : 12));
    return d;
}

function makeGradientBg(topHex, botHex, radius) {
    var d = new GradientDrawable(
        GradientDrawable.Orientation.TOP_BOTTOM,
        java.lang.reflect.Array.newInstance(java.lang.Integer.TYPE, 2)
    );
    var colors = [Color.parseColor(topHex), Color.parseColor(botHex)];
    d.setColors(colors);
    d.setCornerRadius(dip(radius || 12));
    return d;
}

function myEnt() { return Player.getEntity(); }
function myX()   { return Player.getX(); }
function myY()   { return Player.getY(); }
function myZ()   { return Player.getZ(); }

function toast(msg) {
    ctx.runOnUiThread(new Runnable({ run: function() {
        try { Toast.makeText(ctx, msg, 1).show(); } catch(e){}
    }}));
}

// ============================================================
//  SELECTOR - FUNCIONES
// ============================================================
function filterPlayers() {
    var filtered = [];
    try {
        var players = Server.getAllPlayers();
        for (var i = 0; i < players.length; i++) {
            if (players[i] == myEnt()) continue;
            var pname = "";
            try { pname = Player.getName(players[i]); } catch(e) {}
            if (pname.indexOf("§8") === 0) continue;
            filtered.push({ ent: players[i], name: pname });
        }
    } catch(e) {}
    return filtered;
}

// ============================================================
//  HTTP CLIENT
// ============================================================
function httpPost(urlStr, jsonStr, headers) {
    try {
        var url = new URL(urlStr);
        var con = url.openConnection();
        con.setRequestMethod("POST");
        con.setConnectTimeout(5000);
        con.setReadTimeout(8000);
        con.setDoOutput(true);
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("User-Agent", "Mozilla/5.0");
        if (headers) {
            for (var h in headers) {
                con.setRequestProperty(h, headers[h]);
            }
        }
        var os = con.getOutputStream();
        os.write(java.lang.String(jsonStr).getBytes("UTF-8"));
        os.flush();
        os.close();
        var reader = new BufferedReader(new InputStreamReader(con.getInputStream()));
        var response = "", line;
        while ((line = reader.readLine()) != null) response += line;
        reader.close();
        var start = response.indexOf("{");
        var end = response.lastIndexOf("}");
        if (start != -1 && end != -1) response = response.substring(start, end + 1);
        return JSON.parse(response);
    } catch(e) {
        return { success: false, message: "Connection error: " + e };
    }
}

function httpGet(urlStr, headers) {
    try {
        var url = new URL(urlStr);
        var con = url.openConnection();
        con.setRequestMethod("GET");
        con.setRequestProperty("User-Agent", "Mozilla/5.0");
        if (headers) {
            for (var h in headers) {
                con.setRequestProperty(h, headers[h]);
            }
        }
        con.setConnectTimeout(5000);
        con.setReadTimeout(8000);
        var reader = new BufferedReader(new InputStreamReader(con.getInputStream()));
        var response = "", line;
        while ((line = reader.readLine()) != null) response += line;
        reader.close();
        var start = response.indexOf("{");
        var end = response.lastIndexOf("}");
        if (start != -1 && end != -1) response = response.substring(start, end + 1);
        return JSON.parse(response);
    } catch(e) {
        return { success: false, message: "Connection error" };
    }
}

// ============================================================
//  ESP OVERLAY
// ============================================================
function createESPOverlay() {
    ctx.runOnUiThread(new Runnable({ run: function() {
        try {
            if (espOverlayView == null) {
                espOverlayView = new TextView(ctx);
                espOverlayView.setTextSize(11);
                espOverlayView.setTypeface(null, 1);
                espOverlayView.setPadding(dip(6), dip(4), dip(6), dip(4));
                espOverlayView.setShadowLayer(dip(2), 0, 0, Color.parseColor("#FF000000"));
                espOverlayView.setTextColor(Color.parseColor("#FF8B6CFF"));
            }
        } catch(e){}
    }}));
}

function updateESPOverlay(text) {
    if (espOverlayView != null) {
        ctx.runOnUiThread(new Runnable({ run: function() {
            try {
                espOverlayView.setText(text);
                if (espOverlayView.getParent() == null) {
                    var w = ctx.getWindowManager().getDefaultDisplay().getWidth();
                    ctx.getWindow().getDecorView().addView(espOverlayView, dip(w), dip(600));
                }
            } catch(e){}
        }}));
    }
}

function clearESPOverlay() {
    if (espOverlayView != null) {
        ctx.runOnUiThread(new Runnable({ run: function() {
            try {
                espOverlayView.setText("");
                if (espOverlayView.getParent() != null) {
                    ctx.getWindow().getDecorView().removeView(espOverlayView);
                }
            } catch(e){}
        }}));
        espOverlayView = null;
    }
}

// ============================================================
//  DISTANCE FLOAT
// ============================================================
function createDistFloat() {
    ctx.runOnUiThread(new Runnable({ run: function() {
        try {
            if (distFloatView == null) {
                distFloatView = new TextView(ctx);
                distFloatView.setTextSize(28);
                distFloatView.setTypeface(null, 1);
                distFloatView.setGravity(Gravity.CENTER);
                distFloatView.setTextColor(Color.parseColor("#FF8B6CFF"));
                distFloatView.setShadowLayer(dip(4), 0, 0, Color.parseColor("#FF000000"));
                distFloatView.setPadding(dip(20), dip(10), dip(20), dip(10));
                var lp = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                );
                lp.gravity = Gravity.CENTER;
                distFloatView.setLayoutParams(lp);
            }
        } catch(e){}
    }}));
}

function updateDistFloat(text) {
    if (distFloatView != null) {
        ctx.runOnUiThread(new Runnable({ run: function() {
            try {
                distFloatView.setText(text);
                if (distFloatView.getParent() == null) {
                    ctx.getWindow().getDecorView().addView(distFloatView);
                }
            } catch(e){}
        }}));
    }
}

function clearDistFloat() {
    if (distFloatView != null) {
        ctx.runOnUiThread(new Runnable({ run: function() {
            try {
                distFloatView.setText("");
                if (distFloatView.getParent() != null) {
                    ctx.getWindow().getDecorView().removeView(distFloatView);
                }
            } catch(e){}
        }}));
        distFloatView = null;
    }
}

// ============================================================
//  WIDGETS BASE
// ============================================================
function makeCardRow() {
    var row = new LinearLayout(ctx);
    row.setOrientation(0);
    row.setBackgroundDrawable(makeRoundedBg(C.BG_CARD, C.LINE, 12));
    row.setPadding(dip(14), dip(13), dip(14), dip(13));
    row.setGravity(Gravity.CENTER_VERTICAL);
    var lp = new LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        LinearLayout.LayoutParams.WRAP_CONTENT
    );
    lp.setMargins(0, dip(5), 0, dip(5));
    row.setLayoutParams(lp);
    return row;
}

function makeToggleRow(layout, label, desc, initialState, onToggle, accentColor) {
    var row   = makeCardRow();
    var state = [initialState];
    var ac    = accentColor || C.ACCENT;

    var textCol = new LinearLayout(ctx);
    textCol.setOrientation(1);
    var textLp = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1);

    var titleTv = new TextView(ctx);
    titleTv.setText(label);
    titleTv.setTextSize(14);
    titleTv.setTypeface(null, 1);
    titleTv.setTextColor(Color.parseColor(C.TEXT_MAIN));
    textCol.addView(titleTv);

    if (desc) {
        var descTv = new TextView(ctx);
        descTv.setText(desc);
        descTv.setTextSize(11);
        descTv.setTextColor(Color.parseColor(C.TEXT_SOFT));
        descTv.setPadding(0, dip(2), 0, 0);
        textCol.addView(descTv);
    }
    row.addView(textCol, textLp);

    var pill = new TextView(ctx);
    pill.setTextSize(10);
    pill.setTypeface(null, 1);
    pill.setGravity(Gravity.CENTER);
    pill.setPadding(dip(16), dip(5), dip(16), dip(5));

    function paintPill() {
        if (state[0]) {
            pill.setText("ON");
            pill.setTextColor(Color.parseColor("#FFFFFFFF"));
            pill.setBackgroundDrawable(makeGradientBg(ac, ac, 20));
        } else {
            pill.setText("OFF");
            pill.setTextColor(Color.parseColor(C.TEXT_SOFT));
            pill.setBackgroundDrawable(makeRoundedBg(C.OFF, null, 20));
        }
    }
    paintPill();

    row.setOnClickListener(new View.OnClickListener({
        onClick: function() {
            state[0] = !state[0];
            paintPill();
            onToggle(state[0]);
            try { Level.playSound(myX(), myY(), myZ(), "random.click", 0.4, state[0] ? 1.4 : 0.8); } catch(e){}
        }
    }));

    row.addView(pill);
    layout.addView(row);
    return row;
}

function makeSliderRow(layout, label, desc, initialValue, minVal, maxVal, stepVal, onSliderChange) {
    var outer = makeCardRow();
    var state = [initialValue];

    var textCol = new LinearLayout(ctx);
    textCol.setOrientation(1);
    var textLp = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1);

    var titleTv = new TextView(ctx);
    titleTv.setText(label + "  [" + initialValue + "]");
    titleTv.setTextSize(13);
    titleTv.setTypeface(null, 1);
    titleTv.setTextColor(Color.parseColor(C.TEXT_MAIN));
    textCol.addView(titleTv);

    if (desc) {
        var descTv = new TextView(ctx);
        descTv.setText(desc);
        descTv.setTextSize(10);
        descTv.setTextColor(Color.parseColor(C.TEXT_SOFT));
        descTv.setPadding(0, dip(2), 0, 0);
        textCol.addView(descTv);
    }
    outer.addView(textCol, textLp);

    var minusBtn = new Button(ctx);
    minusBtn.setText("-");
    minusBtn.setTextSize(14);
    minusBtn.setTypeface(null, 1);
    minusBtn.setGravity(Gravity.CENTER);
    minusBtn.setPadding(dip(12), dip(4), dip(12), dip(4));
    minusBtn.setBackgroundDrawable(makeRoundedBg(C.OFF, C.LINE, 8));
    minusBtn.setOnClickListener(new View.OnClickListener({
        onClick: function() {
            if (state[0] > minVal) {
                state[0] = Math.round((state[0] - stepVal) * 100) / 100;
                titleTv.setText(label + "  [" + state[0] + "]");
                onSliderChange(state[0]);
            }
        }
    }));
    outer.addView(minusBtn);

    var plusBtn = new Button(ctx);
    plusBtn.setText("+");
    plusBtn.setTextSize(14);
    plusBtn.setTypeface(null, 1);
    plusBtn.setGravity(Gravity.CENTER);
    plusBtn.setPadding(dip(12), dip(4), dip(12), dip(4));
    plusBtn.setBackgroundDrawable(makeRoundedBg(C.ACCENT, C.ACCENT, 8));
    plusBtn.setTextColor(Color.parseColor("#FFFFFFFF"));
    plusBtn.setOnClickListener(new View.OnClickListener({
        onClick: function() {
            if (state[0] < maxVal) {
                state[0] = Math.round((state[0] + stepVal) * 100) / 100;
                titleTv.setText(label + "  [" + state[0] + "]");
                onSliderChange(state[0]);
            }
        }
    }));
    outer.addView(plusBtn);

    layout.addView(outer);
    return outer;
}

function makeStepSliderRow(layout, label, desc, initialValue, steps, onSliderChange) {
    var outer = makeCardRow();
    var currentIndex = 0;
    for (var i = 0; i < steps.length; i++) {
        if (steps[i] == initialValue) {
            currentIndex = i;
            break;
        }
    }
    var state = [currentIndex];

    var textCol = new LinearLayout(ctx);
    textCol.setOrientation(1);
    var textLp = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1);

    var titleTv = new TextView(ctx);
    titleTv.setText(label + "  [" + steps[state[0]] + "]");
    titleTv.setTextSize(13);
    titleTv.setTypeface(null, 1);
    titleTv.setTextColor(Color.parseColor(C.TEXT_MAIN));
    textCol.addView(titleTv);

    if (desc) {
        var descTv = new TextView(ctx);
        descTv.setText(desc);
        descTv.setTextSize(10);
        descTv.setTextColor(Color.parseColor(C.TEXT_SOFT));
        descTv.setPadding(0, dip(2), 0, 0);
        textCol.addView(descTv);
    }
    outer.addView(textCol, textLp);

    var minusBtn = new Button(ctx);
    minusBtn.setText("-");
    minusBtn.setTextSize(14);
    minusBtn.setTypeface(null, 1);
    minusBtn.setGravity(Gravity.CENTER);
    minusBtn.setPadding(dip(12), dip(4), dip(12), dip(4));
    minusBtn.setBackgroundDrawable(makeRoundedBg(C.OFF, C.LINE, 8));
    minusBtn.setOnClickListener(new View.OnClickListener({
        onClick: function() {
            if (state[0] > 0) {
                state[0]--;
                var val = steps[state[0]];
                titleTv.setText(label + "  [" + val + "]");
                onSliderChange(val);
            }
        }
    }));
    outer.addView(minusBtn);

    var plusBtn = new Button(ctx);
    plusBtn.setText("+");
    plusBtn.setTextSize(14);
    plusBtn.setTypeface(null, 1);
    plusBtn.setGravity(Gravity.CENTER);
    plusBtn.setPadding(dip(12), dip(4), dip(12), dip(4));
    plusBtn.setBackgroundDrawable(makeRoundedBg(C.ACCENT, C.ACCENT, 8));
    plusBtn.setTextColor(Color.parseColor("#FFFFFFFF"));
    plusBtn.setOnClickListener(new View.OnClickListener({
        onClick: function() {
            if (state[0] < steps.length - 1) {
                state[0]++;
                var val = steps[state[0]];
                titleTv.setText(label + "  [" + val + "]");
                onSliderChange(val);
            }
        }
    }));
    outer.addView(plusBtn);

    layout.addView(outer);
    return outer;
}

function makeActionRow(layout, icon, label, desc, danger, onClick) {
    var row = makeCardRow();
    var textCol = new LinearLayout(ctx);
    textCol.setOrientation(1);
    var textLp = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1);

    var tv = new TextView(ctx);
    tv.setText(icon + "  " + label);
    tv.setTextSize(14);
    tv.setTypeface(null, 1);
    tv.setTextColor(Color.parseColor(danger ? C.DANGER : C.TEXT_MAIN));
    textCol.addView(tv);

    if (desc) {
        var descTv = new TextView(ctx);
        descTv.setText(desc);
        descTv.setTextSize(11);
        descTv.setTextColor(Color.parseColor(C.TEXT_SOFT));
        descTv.setPadding(0, dip(2), 0, 0);
        textCol.addView(descTv);
    }
    row.addView(textCol, textLp);

    var chevron = new TextView(ctx);
    chevron.setText(">");
    chevron.setTextSize(18);
    chevron.setTextColor(Color.parseColor(danger ? C.DANGER : C.ACCENT));
    row.addView(chevron);

    row.setOnClickListener(new View.OnClickListener({ onClick: onClick }));
    layout.addView(row);
    return row;
}

function makeCatRow(layout, icon, label, desc, onClick) {
    var outer = new LinearLayout(ctx);
    outer.setOrientation(0);
    outer.setBackgroundDrawable(makeRoundedBg(C.BG_CARD2, C.LINE, 14));
    outer.setPadding(dip(4), dip(4), dip(4), dip(4));
    var outerLp = new LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        LinearLayout.LayoutParams.WRAP_CONTENT
    );
    outerLp.setMargins(0, dip(5), 0, dip(5));
    outer.setLayoutParams(outerLp);

    var bar = new View(ctx);
    bar.setBackgroundColor(Color.parseColor(C.ACCENT));
    outer.addView(bar, new LinearLayout.LayoutParams(dip(4), LinearLayout.LayoutParams.MATCH_PARENT));

    var textBox = new LinearLayout(ctx);
    textBox.setOrientation(1);
    textBox.setPadding(dip(14), dip(13), dip(10), dip(13));

    var titleTv = new TextView(ctx);
    titleTv.setText(icon + "  " + label);
    titleTv.setTextSize(15);
    titleTv.setTypeface(null, 1);
    titleTv.setTextColor(Color.parseColor(C.TEXT_MAIN));
    textBox.addView(titleTv);

    if (desc) {
        var descTv = new TextView(ctx);
        descTv.setText(desc);
        descTv.setTextSize(11);
        descTv.setTextColor(Color.parseColor(C.TEXT_SOFT));
        descTv.setPadding(0, dip(3), 0, 0);
        textBox.addView(descTv);
    }
    outer.addView(textBox, new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1));

    var chevron = new TextView(ctx);
    chevron.setText(">");
    chevron.setTextSize(20);
    chevron.setTextColor(Color.parseColor(C.ACCENT));
    chevron.setPadding(dip(6), 0, dip(14), 0);
    chevron.setGravity(Gravity.CENTER_VERTICAL);
    outer.addView(chevron);

    outer.setOnClickListener(new View.OnClickListener({ onClick: onClick }));
    layout.addView(outer);
}

function makeDivider(layout, label) {
    if (label) {
        var tv = new TextView(ctx);
        tv.setText(label.toUpperCase());
        tv.setTextSize(10);
        tv.setTypeface(null, 1);
        tv.setLetterSpacing(0.1);
        tv.setTextColor(Color.parseColor(C.ACCENT));
        tv.setPadding(dip(6), dip(12), dip(4), dip(4));
        layout.addView(tv);
    }
    var line = new View(ctx);
    var gradLine = new GradientDrawable(
        GradientDrawable.Orientation.LEFT_RIGHT,
        [Color.parseColor("#00000000"), Color.parseColor(C.ACCENT), Color.parseColor("#00000000")]
    );
    line.setBackgroundDrawable(gradLine);
    var lp = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dip(1));
    lp.setMargins(dip(4), dip(2), dip(4), dip(6));
    layout.addView(line, lp);
}

function buildHeader(layout, subtitle) {
    var header = new LinearLayout(ctx);
    header.setOrientation(1);
    header.setPadding(dip(6), dip(16), dip(6), dip(12));

    var titleRow = new LinearLayout(ctx);
    titleRow.setOrientation(0);
    titleRow.setGravity(Gravity.CENTER_VERTICAL);

    var mark = new TextView(ctx);
    mark.setText("[MX]");
    mark.setTextSize(14);
    mark.setTypeface(null, 1);
    mark.setTextColor(Color.parseColor(C.ACCENT));
    mark.setPadding(0, 0, dip(8), 0);
    titleRow.addView(mark);

    var titleTv = new TextView(ctx);
    titleTv.setText("Modz X");
    titleTv.setTextSize(22);
    titleTv.setTypeface(null, 1);
    titleTv.setTextColor(Color.parseColor(C.TEXT_MAIN));
    titleRow.addView(titleTv);

    var ver = new TextView(ctx);
    ver.setText("V50");
    ver.setTextSize(9);
    ver.setTypeface(null, 1);
    ver.setTextColor(Color.parseColor(C.ACCENT2));
    ver.setPadding(dip(8), dip(2), 0, 0);
    titleRow.addView(ver);

    header.addView(titleRow);

    var sub = new TextView(ctx);
    sub.setText((subtitle || "Inicio") + "  ·  " + AUTH_STATUS);
    sub.setTextSize(11);
    sub.setTextColor(Color.parseColor(C.TEXT_SOFT));
    sub.setPadding(dip(28), dip(3), 0, 0);
    header.addView(sub);

    var line = new View(ctx);
    var gradLine = new GradientDrawable(
        GradientDrawable.Orientation.LEFT_RIGHT,
        [Color.parseColor(C.ACCENT), Color.parseColor(C.ACCENT2)]
    );
    line.setBackgroundDrawable(gradLine);
    var lp = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, dip(2));
    lp.setMargins(0, dip(10), 0, 0);
    header.addView(line, lp);

    layout.addView(header);
}

function makeBackBtn(layout, popRef, targetFn) {
    var btn = new Button(ctx);
    btn.setText("< Volver");
    btn.setTextColor(Color.parseColor(C.ACCENT));
    btn.setTextSize(13);
    btn.setTypeface(null, 1);
    btn.setAllCaps(false);
    btn.setPadding(dip(14), dip(11), dip(14), dip(11));
    btn.setBackgroundDrawable(makeRoundedBg(C.BACK_BG, C.ACCENT, 12));
    var lp = new LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
    );
    lp.setMargins(0, dip(16), 0, dip(4));
    btn.setLayoutParams(lp);
    btn.setOnClickListener(new View.OnClickListener({
        onClick: function() {
            closeAllMenus();
            targetFn();
        }
    }));
    layout.addView(btn);
}

// ============================================================
//  POPUP BASE
// ============================================================
function buildPanel() {
    var outer  = new LinearLayout(ctx);
    var scroll = new ScrollView(ctx);
    var inner  = new LinearLayout(ctx);
    outer.setOrientation(1);
    inner.setOrientation(1);
    inner.setPadding(dip(10), dip(4), dip(10), dip(16));
    inner.setBackgroundDrawable(makeRoundedBg(C.BG_PANEL, C.LINE, 16));
    scroll.addView(inner);
    outer.addView(scroll);
    return { outer: outer, inner: inner };
}

function safeDismiss(popup) {
    try { if (popup != null && popup.isShowing()) popup.dismiss(); } catch(e) {}
}

function closeAllMenus() {
    safeDismiss(menu); safeDismiss(menu1); safeDismiss(menu2); safeDismiss(menu3);
    safeDismiss(menu4); safeDismiss(menu5); safeDismiss(menu6); safeDismiss(menu7);
    safeDismiss(menu8); safeDismiss(menu9);
    safeDismiss(menuSelectorRef[0]); safeDismiss(menuPlayerRef[0]); safeDismiss(menuPlayerActionsRef[0]);
    menu = menu1 = menu2 = menu3 = menu4 = menu5 = menu6 = menu7 = menu8 = menu9 = null;
    menuSelectorRef[0] = null;
    menuPlayerRef[0] = null;
    menuPlayerActionsRef[0] = null;
}

function closeFab() {
    safeDismiss(GUI);
    GUI = null;
}

function makeSubPopup(outerLayout) {
    closeAllMenus();
    var w = Math.round(ctx.getWindowManager().getDefaultDisplay().getWidth() / 2);
    var h = ctx.getWindowManager().getDefaultDisplay().getHeight() - dip(20);
    var pop = new PopupWindow(outerLayout, w, h);
    pop.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
    pop.setAnimationStyle(android.R.style.Animation_InputMethod);
    pop.showAtLocation(ctx.getWindow().getDecorView(), Gravity.LEFT | Gravity.TOP, 0, 0);
    return pop;
}

// ============================================================
//  LOGIN GESTIONADO POR EL LOADER
// ============================================================
// El loader valida la key y carga este archivo con AUTH_PLAN/AUTH_EXPIRE.
// Este menú no muestra otra pantalla de login ni envía credenciales.
function showLoginGUI() {
    closeAllMenus();
    if (typeof menuBtn == "function") menuBtn();
}

// ============================================================
//  FAB
// ============================================================
function menuBtn() {
    ctx.runOnUiThread(new Runnable({ run: function() {
        try {
            if (GUI != null && GUI.isShowing()) return;

            var root = new LinearLayout(ctx);
            root.setOrientation(1);

            var fab = new Button(ctx);
            fab.setText("[MX]");
            fab.setTextColor(Color.parseColor(C.ACCENT));
            fab.setTextSize(12);
            fab.setTypeface(null, 1);
            fab.setPadding(0, 0, 0, 0);
            fab.setGravity(Gravity.CENTER);
            fab.setAllCaps(false);

            var fabBg = new GradientDrawable();
            fabBg.setColor(Color.parseColor("#F0101020"));
            fabBg.setStroke(dip(2), Color.parseColor(C.ACCENT));
            fabBg.setCornerRadius(dip(30));
            fab.setBackgroundDrawable(fabBg);

            var pulseAnim = new ScaleAnimation(1, 1.1, 1, 1.1,
                Animation.RELATIVE_TO_SELF, 0.5,
                Animation.RELATIVE_TO_SELF, 0.5);
            pulseAnim.setDuration(800);
            pulseAnim.setRepeatCount(Animation.INFINITE);
            pulseAnim.setRepeatMode(Animation.REVERSE);
            fab.startAnimation(pulseAnim);

            var startX = [0], startY = [0], lastX = [0], lastY = [0], moved = [false];
            fab.setOnTouchListener(new View.OnTouchListener({
                onTouch: function(view, event) {
                    try {
                        var action = event.getAction();
                        if (action == android.view.MotionEvent.ACTION_DOWN) {
                            startX[0] = event.getRawX();
                            startY[0] = event.getRawY();
                            lastX[0] = startX[0];
                            lastY[0] = startY[0];
                            moved[0] = false;
                            return true;
                        }
                        if (action == android.view.MotionEvent.ACTION_MOVE) {
                            var rawX = event.getRawX(), rawY = event.getRawY();
                            if (Math.abs(rawX - startX[0]) > dip(4) || Math.abs(rawY - startY[0]) > dip(4)) moved[0] = true;
                            if (moved[0] && GUI != null) {
                                fabX += Math.round(rawX - lastX[0]);
                                fabY += Math.round(rawY - lastY[0]);
                                var display = ctx.getWindowManager().getDefaultDisplay();
                                fabX = Math.max(0, Math.min(fabX, display.getWidth() - dip(52)));
                                fabY = Math.max(0, Math.min(fabY, display.getHeight() - dip(52)));
                                GUI.update(fabX, fabY, -1, -1);
                            }
                            lastX[0] = rawX;
                            lastY[0] = rawY;
                            return true;
                        }
                        if (action == android.view.MotionEvent.ACTION_UP) {
                            if (!moved[0]) {
                                closeFab();
                                mainMenu();
                            }
                            return true;
                        }
                    } catch(e) {}
                    return true;
                }
            }));
            root.addView(fab);

            var display = ctx.getWindowManager().getDefaultDisplay();
            if (fabX < 0) fabX = display.getWidth() - dip(56);
            GUI = new PopupWindow(root, dip(52), dip(52));
            GUI.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            GUI.showAtLocation(ctx.getWindow().getDecorView(), Gravity.LEFT | Gravity.TOP, fabX, fabY);
        } catch(e) { print("FAB: " + e); }
    }}));
}

// ============================================================
//  STATUS
// ============================================================
function getStatusLine() {
    var parts = [];
    if (nightVisionOn)  parts.push("NV");
    if (killAuraOn)     parts.push("KillAura");
    if (autoAttackOn)   parts.push("AutoAtk");
    if (fastHitOn)      parts.push("FastHit");
    if (stealthKillOn)  parts.push("StealthKill");
    if (playerDetectOn) parts.push("Detect");
    if (espOverlayOn)   parts.push("ESP");
    if (findChestOn)    parts.push("Chest");
    if (findHopperOn)   parts.push("Hopper");
    if (distFloatOn)    parts.push("Dist");
    if (autoSpawnOn)    parts.push("AutoSpawn");
    if (autoKillOn)     parts.push("AutoKill");
    if (antiJakOn)      parts.push("AntiJak");
    if (noFallOn)       parts.push("NoFall");
    if (flyOn)          parts.push("Fly");
    if (godModeOn)      parts.push("God");
    if (slowWalkOn)     parts.push("SlowWalk");
    if (tipDistOn)      parts.push("TipDist");
    if (tipCoordsOn)    parts.push("TipCoords");
    return parts.length > 0 ? parts.join(" | ") : "ninguno";
}

// ============================================================
//  REFRESH PLAYER SNAPSHOT
// ============================================================
function refreshPlayerSnapshot() {
    playerSnapshot = [];
    try {
        var players = Server.getAllPlayers();
        for (var i = 0; i < players.length; i++) {
            if (players[i] != myEnt()) {
                playerSnapshot.push(players[i]);
            }
        }
    } catch(e) {}
}

// ============================================================
//  MENU PRINCIPAL
// ============================================================
function mainMenu() {
    ctx.runOnUiThread(new Runnable({ run: function() {
        try {
            var p = buildPanel(); var inner = p.inner;
            buildHeader(inner, "Inicio");

            var sesionTv = new TextView(ctx);
            sesionTv.setText("Plan: " + AUTH_PLAN);
            sesionTv.setTextSize(11);
            sesionTv.setTextColor(Color.parseColor(C.TEXT_SOFT));
            sesionTv.setPadding(dip(4), 0, dip(4), dip(4));
            inner.addView(sesionTv);

            var sesionTv2 = new TextView(ctx);
            sesionTv2.setText("Expire: " + AUTH_EXPIRE);
            sesionTv2.setTextSize(10);
            sesionTv2.setTextColor(Color.parseColor(C.TEXT_DIM));
            sesionTv2.setPadding(dip(4), 0, dip(4), dip(8));
            inner.addView(sesionTv2);

            var statusTv = new TextView(ctx);
            statusTv.setText("Activo: " + getStatusLine());
            statusTv.setTextSize(12);
            statusTv.setTextColor(Color.parseColor(C.ACCENT));
            statusTv.setPadding(dip(4), 0, dip(4), dip(14));
            inner.addView(statusTv);

            makeCatRow(inner, "[K]", "Combate",
                "KillAura | AutoAttack | FastHit | StealthKill",
                function() { closeAllMenus(); menuCombate(); }
            );
            makeCatRow(inner, "[P]", "Player Menu",
                "TP | Matar | Info | Distancia | Fuego | Vacio",
                function() { closeAllMenus(); menuPlayer(); }
            );
            makeCatRow(inner, "[*]", "Selector",
                "Selecciona jugador | Tip distancia | Tip coords",
                function() { closeAllMenus(); menuSelector(); }
            );
            makeCatRow(inner, "[S]", "Server Menu",
                "Login AOS | Check estado",
                function() { closeAllMenus(); menuServer(); }
            );
            makeCatRow(inner, "[E]", "ESP Overlay",
                "Radar jugadores | cofres | tolvas en pantalla",
                function() { closeAllMenus(); menuESP(); }
            );
            makeCatRow(inner, "[D]", "Deteccion",
                "Player Detect | Find Chest | Find Tolva",
                function() { closeAllMenus(); menuDeteccion(); }
            );
            makeCatRow(inner, "[~]", "Movimiento",
                "Fly | NoFall | God Mode | AntiJak",
                function() { closeAllMenus(); menuMovimiento(); }
            );
            makeCatRow(inner, "[C]", "Chat / Utilidades",
                "Comandos | YouTube | Logout",
                function() { closeAllMenus(); menuChat(); }
            );

            makeDivider(inner, "Sistema");

            makeActionRow(inner, "[X]", "Desactivar todo", "Apaga todos los modulos", true, function() {
                nightVisionOn = false; playerDetectOn = false; espOverlayOn = false;
                findChestOn = false; findHopperOn = false;
                distFloatOn = false; distFloatTarget = null; autoSpawnOn = false;
                autoKillOn = false; autoSpawnArmed = true; autoKillArmed = true;
                antiJakOn = false; noFallOn = false;
                flyOn = false; godModeOn = false; slowWalkOn = false;
                killAuraOn = false; autoAttackOn = false; fastHitOn = false;
                stealthKillOn = false; hitboxOn = false; hitboxSize = 1.1;
                tipDistOn = false; tipCoordsOn = false;
                selectedPlayer = null; selectedPlayerName = "";
                try { Entity.removeAllEffects(myEnt()); } catch(e){}
                clearESPOverlay();
                clearDistFloat();
                statusTv.setText("Activo: ninguno");
                clientMessage("§7Todo desactivado");
            });

            var closeBtn = new Button(ctx);
            closeBtn.setText("Cerrar menu");
            closeBtn.setAllCaps(false);
            closeBtn.setTextColor(Color.parseColor(C.DANGER));
            closeBtn.setTextSize(13);
            closeBtn.setTypeface(null, 1);
            closeBtn.setPadding(dip(14), dip(12), dip(14), dip(12));
            closeBtn.setBackgroundDrawable(makeRoundedBg("#FF1E1418", C.DANGER, 12));
            var clp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
            );
            clp.setMargins(0, dip(12), 0, 0);
            closeBtn.setLayoutParams(clp);
            closeBtn.setOnClickListener(new View.OnClickListener({
                onClick: function() { closeAllMenus(); menuBtn(); }
            }));
            inner.addView(closeBtn);

            menu = makeSubPopup(p.outer);
        } catch(e) { print("mainMenu: " + e); }
    }}));
}

// ============================================================
//  COMBATE
// ============================================================
function menuCombate() {
    ctx.runOnUiThread(new Runnable({ run: function() {
        try {
            var p = buildPanel(); var inner = p.inner;
            buildHeader(inner, "Combate");

            makeDivider(inner, "Ataque automatico");

            makeToggleRow(inner, "KillAura Stealth",
                "Ataca jugadores cercanos. Ajusta el rango abajo.",
                killAuraOn, function(v) {
                    killAuraOn = v;
                    clientMessage(v ? "§dKillAura ON" : "§7KillAura OFF");
                }, C.DANGER
            );
            makeSliderRow(inner, "KillAura Range", "Rango de KillAura (bloques)",
                killAuraRange, 2.0, 6.0, 0.5, function(val) { killAuraRange = val; }
            );

            makeToggleRow(inner, "Auto Attack",
                "Reduce HP del jugador cercano automaticamente.",
                autoAttackOn, function(v) {
                    autoAttackOn = v;
                    autoAttackTick = 0;
                    clientMessage(v ? "§dAutoAttack ON" : "§7AutoAttack OFF");
                }
            );
            makeSliderRow(inner, "AutoAttack Range", "Rango de autoataque (bloques)",
                autoAttackRange, 2.0, 6.0, 0.5, function(val) { autoAttackRange = val; }
            );
            makeSliderRow(inner, "AutoAttack Delay", "Ticks entre ataques (menos = mas rapido)",
                autoAttackDelay, 4, 20, 2, function(val) { autoAttackDelay = val; }
            );

            makeDivider(inner, "Tecnicas");

            makeToggleRow(inner, "FastHit",
                "Clicks rapidos simulados (~12 CPS).",
                fastHitOn, function(v) {
                    fastHitOn = v;
                    clientMessage(v ? "§dFastHit ON" : "§7FastHit OFF");
                }, C.DANGER
            );
            makeToggleRow(inner, "Stealth Kill",
                "KillAura lento (-1 corazon por ciclo). Mas disimulado.",
                stealthKillOn, function(v) {
                    stealthKillOn = v;
                    clientMessage(v ? "§dStealthKill ON" : "§7StealthKill OFF");
                }, C.DANGER
            );

            makeDivider(inner, "Hitbox");

            makeToggleRow(inner, "Hitbox Expand",
                "Agranda la hitbox del jugador apuntado. Ajusta el tamanio abajo.",
                hitboxOn, function(v) {
                    hitboxOn = v;
                    if (!v) {
                        // Restaurar hitbox normal al desactivar
                        try {
                            var t = Player.getPointedEntity();
                            if (t != -1) Entity.setCollisionSize(t, 0.6, 1.8);
                        } catch(e) {}
                    }
                    clientMessage(v ? "§dHitbox ON [" + hitboxSize + "]" : "§7Hitbox OFF");
                }, C.WARN
            );
            makeStepSliderRow(inner, "Hitbox Size", "Tamanio: 1.1 1.2, 1.3, 1.4, 1.5 y 2.0 (max)",
                hitboxSize, [1.1, 1.2, 1.3, 1.4, 1.5, 2.0], function(val) {
                    hitboxSize = val;
                    clientMessage("§dHitbox Size: " + val);
                }
            );

            var popRef = [null];
            makeBackBtn(inner, popRef, function() { mainMenu(); });
            menu5 = makeSubPopup(p.outer);
            popRef[0] = menu5;
        } catch(e) { toast("Error Combate: " + e); }
    }}));
}

// ============================================================
//  PLAYER MENU
// ============================================================
function menuPlayer() {
    ctx.runOnUiThread(new Runnable({ run: function() {
        try {
            var p = buildPanel(); var inner = p.inner;
            buildHeader(inner, "Player Menu");

            makeActionRow(inner, "[R]", "Actualizar lista", "Recarga la lista de jugadores", false, function() {
                refreshPlayerSnapshot();
                menuPlayerRef[0].dismiss();
                menuPlayer();
                clientMessage("§dLista actualizada");
            });

            makeDivider(inner, "Jugadores (" + playerSnapshot.length + ")");

            if (playerSnapshot.length == 0) {
                var noPl = new TextView(ctx);
                noPl.setText("No hay otros jugadores. Toca 'Actualizar lista'.");
                noPl.setTextSize(12);
                noPl.setTextColor(Color.parseColor(C.TEXT_DIM));
                noPl.setPadding(dip(4), dip(8), dip(4), dip(8));
                inner.addView(noPl);
            }

            for (var i = 0; i < playerSnapshot.length; i++) {
                (function(idx) {
                    var ent = playerSnapshot[idx];
                    var pname = "";
                    var dist = 999;
                    try {
                        pname = Player.getName(ent);
                        dist = getPlayerDistance(ent);
                    } catch(e) {
                        pname = "Player_" + idx;
                    }
                    makeActionRow(inner, "[P]", pname,
                        "Dist: " + Math.round(dist) + "m", false, function() {
                        showPlayerActions(ent, pname);
                    });
                })(i);
            }

            makeDivider(inner, "Acciones globales");

            makeActionRow(inner, "[P]", "Ir al spawn", "TP a spawn", false, function() {
                Level.setSpawn(0, 100, 0);
                clientMessage("§dSpawn fijado");
            });
            makeActionRow(inner, "[~]", "Guardar posicion", "Muestra coords exactas", false, function() {
                clientMessage("§dPos: X=" + Math.round(myX()) + " Y=" + Math.round(myY()) + " Z=" + Math.round(myZ()));
            });

            var popRef = [null];
            makeBackBtn(inner, popRef, function() { mainMenu(); });
            menuPlayerRef[0] = makeSubPopup(p.outer);
            popRef[0] = menuPlayerRef[0];
        } catch(e) { toast("Error Player: " + e); }
    }}));
}

function showPlayerActions(playerEnt, playerName) {
    ctx.runOnUiThread(new Runnable({ run: function() {
        try {
            var p = buildPanel(); var inner = p.inner;
            buildHeader(inner, "Acciones: " + playerName);

            makeActionRow(inner, "[TP]", "TP a " + playerName, "Teleporte a su posicion", false, function() {
                var px = Entity.getX(playerEnt);
                var py = Entity.getY(playerEnt);
                var pz = Entity.getZ(playerEnt);
                Entity.setPosition(myEnt(), px + 1, py + 1, pz + 1);
                clientMessage("§dTP a " + playerName);
            });
            makeActionRow(inner, "[BR]", "Traer a " + playerName, "TP al jugador a tu pos", false, function() {
                Entity.setPosition(playerEnt, myX() + 2, myY(), myZ());
                clientMessage("§d" + playerName + " traido");
            });
            makeActionRow(inner, "[X]", "Matar a " + playerName, "HP a 0", true, function() {
                try { Entity.setHealth(playerEnt, 0); } catch(e){}
                clientMessage("§d" + playerName + " eliminado");
            });
            makeActionRow(inner, "[i]", "Ver coords", "Muestra X, Y, Z", false, function() {
                clientMessage("§d" + playerName + ": X=" + Math.round(Entity.getX(playerEnt)) +
                    " Y=" + Math.round(Entity.getY(playerEnt)) + " Z=" + Math.round(Entity.getZ(playerEnt)));
            });
            makeActionRow(inner, "[d]", "Distancia", "Bloques entre ustedes", false, function() {
                clientMessage("§d" + playerName + " a " + Math.round(getPlayerDistance(playerEnt)) + " bloques");
            });
            makeToggleRow(inner, "Show Distancia Float",
                "Muestra en el CENTRO la distancia a este jugador",
                distFloatTarget == playerEnt, function(v) {
                    if (v) {
                        distFloatOn = true;
                        distFloatTarget = playerEnt;
                        createDistFloat();
                        clientMessage("§dDistancia float ON: " + playerName);
                    } else {
                        distFloatOn = false;
                        distFloatTarget = null;
                        clearDistFloat();
                        clientMessage("§7Distancia float OFF");
                    }
                }, C.ACCENT2
            );
            makeActionRow(inner, "[F]", "Fuego infinito", "Fuego eterno", true, function() {
                try { Entity.setFireTicks(playerEnt, 99999); } catch(e){}
                clientMessage("§d" + playerName + " en llamas");
            });
            makeActionRow(inner, "[V]", "Caer al vacio", "TP bajo el mundo", true, function() {
                try { Entity.setPosition(playerEnt, Entity.getX(playerEnt), -999, Entity.getZ(playerEnt)); } catch(e){}
                clientMessage("§d" + playerName + " al vacio");
            });
            makeActionRow(inner, "[>]", "Empujar lejos", "Lanza 20 bloques", false, function() {
                try {
                    Entity.setVelX(playerEnt, (Entity.getX(playerEnt) - myX()) * 2);
                    Entity.setVelY(playerEnt, 2);
                    Entity.setVelZ(playerEnt, (Entity.getZ(playerEnt) - myZ()) * 2);
                } catch(e){}
                clientMessage("§d" + playerName + " empujado");
            });
            makeActionRow(inner, "[S]", "Stealth Kill a " + playerName, "Lento pero indetectable", true, function() {
                try {
                    var hp = Entity.getHealth(playerEnt);
                    var dmg = Math.min(2, hp);
                    Entity.setHealth(playerEnt, hp - dmg);
                    clientMessage("§d-§c" + dmg + "HP§d a " + playerName);
                } catch(e){}
            });

            var popRef = [null];
            makeBackBtn(inner, popRef, function() { menuPlayer(); });
            menuPlayerActionsRef[0] = makeSubPopup(p.outer);
            popRef[0] = menuPlayerActionsRef[0];
        } catch(e) { toast("Error PlayerActions: " + e); }
    }}));
}

// ============================================================
//  SELECTOR DE JUGADOR
// ============================================================
function menuSelector() {
    ctx.runOnUiThread(new Runnable({ run: function() {
        try {
            var p = buildPanel(); var inner = p.inner;
            buildHeader(inner, "Selector de Jugador");

            var selTv = new TextView(ctx);
            selTv.setText("Seleccionado: " + (selectedPlayerName || "ninguno"));
            selTv.setTextSize(12);
            selTv.setTextColor(Color.parseColor(C.ACCENT));
            selTv.setPadding(dip(4), 0, dip(4), dip(8));
            inner.addView(selTv);

            makeActionRow(inner, "[R]", "Actualizar lista", "Recarga (excluye Superland*)", false, function() {
                menuSelectorRef[0].dismiss();
                menuSelector();
            });

            var lista = filterPlayers();
            makeDivider(inner, "Jugadores (" + lista.length + ")");

            if (lista.length === 0) {
                var noPl = new TextView(ctx);
                noPl.setText("Sin jugadores validos. Actualiza.");
                noPl.setTextSize(12);
                noPl.setTextColor(Color.parseColor(C.TEXT_DIM));
                noPl.setPadding(dip(4), dip(8), dip(4), dip(8));
                inner.addView(noPl);
            }

            for (var i = 0; i < lista.length; i++) {
                (function(item) {
                    var dist = 999;
                    try { dist = getPlayerDistance(item.ent); } catch(e) {}
                    var isSelected = (selectedPlayer == item.ent);
                    makeActionRow(
                        inner,
                        isSelected ? "[*]" : "[ ]",
                        item.name,
                        (isSelected ? "SELECCIONADO -- " : "") + "Dist: " + Math.round(dist) + "m",
                        false,
                        function() {
                            selectedPlayer     = item.ent;
                            selectedPlayerName = item.name;
                            selTv.setText("Seleccionado: " + item.name);
                            clientMessage("§dJugador seleccionado: " + item.name);
                            try { Level.playSound(myX(), myY(), myZ(), "random.click", 0.5, 1.5); } catch(e) {}
                        }
                    );
                })(lista[i]);
            }

            makeDivider(inner, "Tip Overlays");

            makeToggleRow(inner, "Tip: Distancia en tiempo real",
                "Tip con distancia al seleccionado cada 0.5s",
                tipDistOn, function(v) {
                    if (v && selectedPlayer == null) {
                        clientMessage("§cSelecciona un jugador primero");
                        tipDistOn = false;
                        return;
                    }
                    tipDistOn = v;
                    tipDistTick = 0;
                    clientMessage(v ? "§dTip Distancia ON" : "§7Tip Distancia OFF");
                }, C.ACCENT2
            );

            makeToggleRow(inner, "Tip: Coords en tiempo real",
                "Tip con X Y Z del seleccionado cada 0.5s",
                tipCoordsOn, function(v) {
                    if (v && selectedPlayer == null) {
                        clientMessage("§cSelecciona un jugador primero");
                        tipCoordsOn = false;
                        return;
                    }
                    tipCoordsOn = v;
                    tipCoordsTick = 0;
                    clientMessage(v ? "§dTip Coords ON" : "§7Tip Coords OFF");
                }, C.ACCENT2
            );

            makeActionRow(inner, "[X]", "Deseleccionar", "Limpia seleccion y tips", false, function() {
                selectedPlayer     = null;
                selectedPlayerName = "";
                tipDistOn          = false;
                tipCoordsOn        = false;
                selTv.setText("Seleccionado: ninguno");
                clientMessage("§7Deseleccionado");
            });

            var popRef = [null];
            makeBackBtn(inner, popRef, function() { mainMenu(); });
            menuSelectorRef[0] = makeSubPopup(p.outer);
            popRef[0] = menuSelectorRef[0];
        } catch(e) { toast("Error Selector: " + e); }
    }}));
}

// ============================================================
//  SERVER MENU
// ============================================================
function menuServer() {
    ctx.runOnUiThread(new Runnable({ run: function() {
        try {
            var p = buildPanel(); var inner = p.inner;
            buildHeader(inner, "Server Menu");

            var authTv = new TextView(ctx);
            authTv.setText("Auth: " + AUTH_STATUS);
            authTv.setTextSize(12);
            authTv.setTextColor(Color.parseColor(AUTH_STATUS == "Offline" ? C.DANGER : C.SUCCESS));
            authTv.setPadding(dip(4), 0, dip(4), dip(6));
            inner.addView(authTv);

            var forcedTv = new TextView(ctx);
            forcedTv.setText("Forced: " + (AUTH_FORCED ? "SI - debes enviar /test" : "NO"));
            forcedTv.setTextSize(10);
            forcedTv.setTextColor(Color.parseColor(AUTH_FORCED ? C.WARN : C.TEXT_DIM));
            forcedTv.setPadding(dip(4), 0, dip(4), dip(12));
            inner.addView(forcedTv);

            makeDivider(inner, "Autenticacion");

            makeActionRow(inner, "[L]", "Login", "Ingresar key de licencia", false, function() {
                closeAllMenus();
                showLoginGUI();
            });
            makeActionRow(inner, "[C]", "Check Estado", "Verificar si estas baneado/forced", false, function() {
                if (!AUTH_TOKEN) { clientMessage("§cNo hay sesion activa"); return; }
                new Thread(new Runnable({
                    run: function() {
                        try {
                            var res = httpGet(SERVER_URL + "/api/player/check?token=" + AUTH_TOKEN, null);
                            ctx.runOnUiThread(new Runnable({ run: function() {
                                try {
                                    if (res.success) {
                                        if (res.banned) {
                                            clientMessage("§cESTAS BANEADO del servidor");
                                            if (!BANNED_NOTIFIED) { BANNED_NOTIFIED = true; toast("Has sido baneado"); }
                                        } else {
                                            clientMessage("§dNo baneado | Maint: " + res.maintenance);
                                        }
                                        AUTH_FORCED = res.forced || false;
                                        forcedTv.setText("Forced: " + (AUTH_FORCED ? "SI - envia /test" : "NO"));
                                        forcedTv.setTextColor(Color.parseColor(AUTH_FORCED ? C.WARN : C.TEXT_DIM));
                                    } else {
                                        clientMessage("§cError: " + res.message);
                                    }
                                } catch(e){}
                            }}));
                        } catch(e) {}
                    }
                })).start();
            });
            makeActionRow(inner, "[T]", "Enviar /test (Forzado)", "Cuando el admin te fuerza", false, function() {
                if (!AUTH_TOKEN) { clientMessage("§cNo hay sesion activa"); return; }
                try { Server.sendChat("test"); } catch(e){}
                clientMessage("§d/test enviado");
                new Thread(new Runnable({
                    run: function() {
                        try {
                            var body = JSON.stringify({ token: AUTH_TOKEN, message: "test" });
                            var res = httpPost(SERVER_URL + "/api/chat/report", body, null);
                            ctx.runOnUiThread(new Runnable({ run: function() {
                                try {
                                    if (res.success) {
                                        AUTH_FORCED = false;
                                        forcedTv.setText("Forced: NO");
                                        forcedTv.setTextColor(Color.parseColor(C.TEXT_DIM));
                                        clientMessage("§dTest verificado");
                                    }
                                } catch(e){}
                            }}));
                        } catch(e) {}
                    }
                })).start();
            });

            makeDivider(inner, "Servidor");

            makeActionRow(inner, "[S]", "Estado del servidor", "Online | Maintenance | Plan", false, function() {
                if (!AUTH_TOKEN) { clientMessage("§cNo hay sesion activa"); return; }
                new Thread(new Runnable({
                    run: function() {
                        try {
                            var res = httpGet(SERVER_URL + "/api/server/status?token=" + AUTH_TOKEN, null);
                            ctx.runOnUiThread(new Runnable({ run: function() {
                                try {
                                    if (res.success) {
                                        clientMessage("§dServer: " + (res.online ? "ONLINE" : "OFF") +
                                            " | Maint: " + res.maintenance +
                                            " | Plan: " + res.plan +
                                            " | Uptime: " + Math.floor(res.uptime / 60) + "min");
                                    } else {
                                        clientMessage("§cError: " + res.message);
                                    }
                                } catch(e){}
                            }}));
                        } catch(e) {}
                    }
                })).start();
            });
            makeActionRow(inner, "[X]", "Logout", "Cierra sesion", true, function() {
                AUTH_TOKEN = ""; AUTH_USER = ""; AUTH_PLAN = "";
                AUTH_EXPIRE = ""; AUTH_STATUS = "Offline"; AUTH_FORCED = false;
                clientMessage("§7Sesion cerrada");
            });

            var popRef = [null];
            makeBackBtn(inner, popRef, function() { mainMenu(); });
            menu8 = makeSubPopup(p.outer);
            popRef[0] = menu8;
        } catch(e) { toast("Error Server: " + e); }
    }}));
}

// ============================================================
//  ESP OVERLAY MENU
// ============================================================
function menuESP() {
    ctx.runOnUiThread(new Runnable({ run: function() {
        try {
            var p = buildPanel(); var inner = p.inner;
            buildHeader(inner, "ESP Overlay");

            makeToggleRow(inner, "ESP Jugadores (Radar)",
                "Muestra nombre, distancia y coords en pantalla",
                espOverlayOn, function(v) {
                    espOverlayOn = v;
                    if (v) { createESPOverlay(); clientMessage("§dESP ON"); }
                    else { clearESPOverlay(); clientMessage("§7ESP OFF"); }
                }
            );
            makeToggleRow(inner, "Find Chest (switch)",
                "Busca cofres (54/146/130) en radio 30 bloques",
                findChestOn, function(v) {
                    findChestOn = v; chestScanTick = 0; chestFound = [];
                    if (v) { createESPOverlay(); clientMessage("§dFind Chest ON"); }
                    else { chestFound = []; clientMessage("§7Find Chest OFF"); }
                }, C.WARN
            );
            makeToggleRow(inner, "Find Tolva (switch)",
                "Busca tolvas (154) en radio 30 bloques",
                findHopperOn, function(v) {
                    findHopperOn = v; hopperScanTick = 0; hopperFound = [];
                    if (v) { createESPOverlay(); clientMessage("§dFind Tolva ON"); }
                    else { hopperFound = []; clientMessage("§7Find Tolva OFF"); }
                }, C.WARN
            );

            makeDivider(inner, "Escaneo manual");

            makeActionRow(inner, "[S]", "Buscar cofres ahora (30)", "Escaneo instantaneo", false, function() { scanChests(30); refreshOverlay(); });
            makeActionRow(inner, "[S]", "Buscar cofres ahora (50)", "Radio mayor", false, function() { scanChests(50); refreshOverlay(); });
            makeActionRow(inner, "[H]", "Buscar tolvas ahora (30)", "Escaneo instantaneo", false, function() { scanHoppers(30); refreshOverlay(); });

            var popRef = [null];
            makeBackBtn(inner, popRef, function() { mainMenu(); });
            menu6 = makeSubPopup(p.outer);
            popRef[0] = menu6;
        } catch(e) { toast("Error ESP: " + e); }
    }}));
}

// ============================================================
//  DETECCION
// ============================================================
function menuDeteccion() {
    ctx.runOnUiThread(new Runnable({ run: function() {
        try {
            var p = buildPanel(); var inner = p.inner;
            buildHeader(inner, "Deteccion");

            makeToggleRow(inner, "Player Detect", "Alerta si alguien a <= 20 bloques",
                playerDetectOn, function(v) { playerDetectOn = v; detectTick = 0; clientMessage(v ? "§dPlayer Detect ON" : "§7Player Detect OFF"); }
            );
            makeToggleRow(inner, "Find Chest auto", "Escaneo automatico de cofres cada 5s",
                findChestOn, function(v) {
                    findChestOn = v; chestScanTick = 0; chestFound = [];
                    if (v) { createESPOverlay(); clientMessage("§dFind Chest auto ON"); }
                    else { chestFound = []; clientMessage("§7Find Chest auto OFF"); }
                }, C.WARN
            );
            makeToggleRow(inner, "Find Tolva auto", "Escaneo automatico de tolvas cada 5s",
                findHopperOn, function(v) {
                    findHopperOn = v; hopperScanTick = 0; hopperFound = [];
                    if (v) { createESPOverlay(); clientMessage("§dFind Tolva auto ON"); }
                    else { hopperFound = []; clientMessage("§7Find Tolva auto OFF"); }
                }, C.WARN
            );

            makeDivider(inner, "Resultados");
            makeActionRow(inner, "[S]", "Escanear cofres 30", "Busqueda manual", false, function() { scanChests(30); });
            makeActionRow(inner, "[H]", "Escanear tolvas 30", "Busqueda manual", false, function() { scanHoppers(30); });

            var popRef = [null];
            makeBackBtn(inner, popRef, function() { mainMenu(); });
            menu3 = makeSubPopup(p.outer);
            popRef[0] = menu3;
        } catch(e) { toast("Error Deteccion: " + e); }
    }}));
}

// ============================================================
//  MOVIMIENTO
// ============================================================
function menuMovimiento() {
    ctx.runOnUiThread(new Runnable({ run: function() {
        try {
            var p = buildPanel(); var inner = p.inner;
            buildHeader(inner, "Movimiento");

            makeDivider(inner, "Vision");
            makeToggleRow(inner, "Night Vision", "Vision nocturna permanente",
                nightVisionOn, function(v) {
                    nightVisionOn = v;
                    if (v) { Entity.addEffect(myEnt(), 16, 99999, 1, false, true); clientMessage("§dNight Vision ON"); }
                    else { try { Entity.removeEffect(myEnt(), 16); } catch(e){} clientMessage("§7Night Vision OFF"); }
                }
            );

            makeDivider(inner, "Proteccion");
            makeToggleRow(inner, "God Mode", "Mantiene la vida al bajar de 10 HP.",
                godModeOn, function(v) {
                    godModeOn = v;
                    clientMessage(v ? "§dGod Mode ON" : "§7God Mode OFF");
                }, C.DANGER
            );
            makeToggleRow(inner, "NoFall", "No recibes dano al caer",
                noFallOn, function(v) { noFallOn = v; clientMessage(v ? "§dNoFall ON" : "§7NoFall OFF"); }
            );
            makeToggleRow(inner, "Fly", "Vuelo en direccion de mirada. Speed 1.8",
                flyOn, function(v) { flyOn = v; clientMessage(v ? "§dFly ON" : "§7Fly OFF"); }
            );

            makeDivider(inner, "Emergencia");
            makeToggleRow(inner, "Auto Spawn", "Con menos de 4 corazones envia /spawn al instante.",
                autoSpawnOn, function(v) {
                    autoSpawnOn = v;
                    autoSpawnArmed = true;
                    clientMessage(v ? "§dAuto Spawn ON" : "§7Auto Spawn OFF");
                }, C.WARN
            );
            makeToggleRow(inner, "Auto Kill", "Con menos de 2 corazones envia /kill al instante.",
                autoKillOn, function(v) {
                    autoKillOn = v;
                    autoKillArmed = true;
                    clientMessage(v ? "§dAuto Kill ON" : "§7Auto Kill OFF");
                }, C.DANGER
            );

            makeDivider(inner, "Anti-AntiJak");
            makeToggleRow(inner, "Anti-AntiJak", "Detecta y evade anti-cheat",
                antiJakOn, function(v) { antiJakOn = v; jakCheckTick = 0; clientMessage(v ? "§dAntiJak ON" : "§7AntiJak OFF"); }, C.SUCCESS
            );
            makeToggleRow(inner, "SlowWalk", "Limita velocidad a max 0.35 bloques/tick",
                slowWalkOn, function(v) { slowWalkOn = v; if (v) maxVelocity = 0.35; clientMessage(v ? "§dSlowWalk ON" : "§7SlowWalk OFF"); }
            );
            makeSliderRow(inner, "Max Velocity", "Velocidad maxima permitida",
                maxVelocity, 0.1, 0.5, 0.05, function(val) { maxVelocity = val; }
            );

            var popRef = [null];
            makeBackBtn(inner, popRef, function() { mainMenu(); });
            menu4 = makeSubPopup(p.outer);
            popRef[0] = menu4;
        } catch(e) { toast("Error Movimiento: " + e); }
    }}));
}

// ============================================================
//  CHAT / UTILIDADES
// ============================================================
function menuChat() {
    ctx.runOnUiThread(new Runnable({ run: function() {
        try {
            var p = buildPanel(); var inner = p.inner;
            buildHeader(inner, "Chat / Utilidades");

            makeActionRow(inner, "[P]", "Ping", "/ping", false, function() { Server.sendChat("/ping"); });
            makeActionRow(inner, "[V]", "Version", "/version", false, function() { Server.sendChat("/version"); });
            makeActionRow(inner, "[L]", "Lista", "/list", false, function() { Server.sendChat("/list"); });
            makeActionRow(inner, "[C]", "Limpiar suelo", "/scl clear", false, function() {
                Server.sendChat("/scl clear");
                clientMessage("§7Enviado: /scl clear");
            });

            makeDivider(inner, "Links");
            makeActionRow(inner, "[Y]", "YouTube", "@SkylerModz", false, function() {
                var i = new Intent(Intent.ACTION_VIEW);
                i.setData(Uri.parse("https://youtube.com/@SkylerModz"));
                ctx.startActivity(i);
            });

            makeDivider(inner, "Peligroso");
            makeActionRow(inner, "[!]", "Salir del servidor", "Abandona la partida", true, function() {
                ModPE.leaveGame();
            });

            var popRef = [null];
            makeBackBtn(inner, popRef, function() { mainMenu(); });
            menu9 = makeSubPopup(p.outer);
            popRef[0] = menu9;
        } catch(e) { toast("Error Chat: " + e); }
    }}));
}

// ============================================================
//  FUNCIONES AUXILIARES
// ============================================================
function getPlayerDistance(playerEnt) {
    try {
        var dx = Entity.getX(playerEnt) - myX();
        var dy = Entity.getY(playerEnt) - myY();
        var dz = Entity.getZ(playerEnt) - myZ();
        return Math.sqrt(dx*dx + dy*dy + dz*dz);
    } catch(e) { return 999; }
}

function scanChests(radius) {
    chestFound = [];
    var mx = Math.round(myX()), my = Math.round(myY()), mz = Math.round(myZ());
    for (var x = mx - radius; x <= mx + radius; x++) {
        for (var z = mz - radius; z <= mz + radius; z++) {
            for (var y = my - radius; y <= my + radius; y++) {
                try {
                    var bid = Level.getTile(x, y, z);
                    if (bid == 54 || bid == 146 || bid == 130) {
                        var dx = x - myX(), dy = y - myY(), dz = z - myZ();
                        var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                        var type = bid == 54 ? "Cofre" : bid == 146 ? "Cofre Trampa" : "Cofre Ender";
                        chestFound.push([x, y, z, dist, type]);
                    }
                } catch(e) {}
            }
        }
    }
    for (var i = 0; i < chestFound.length; i++) {
        var c = chestFound[i];
        clientMessage("§d[" + c[4] + "] §fX=" + c[0] + " Y=" + c[1] + " Z=" + c[2] + " -- " + Math.round(c[3]) + "m");
    }
    clientMessage(chestFound.length === 0 ? "§7No hay cofres en " + radius + " bloques" : "§d" + chestFound.length + " cofres encontrados");
}

function scanHoppers(radius) {
    hopperFound = [];
    var mx = Math.round(myX()), my = Math.round(myY()), mz = Math.round(myZ());
    for (var x = mx - radius; x <= mx + radius; x++) {
        for (var z = mz - radius; z <= mz + radius; z++) {
            for (var y = my - radius; y <= my + radius; y++) {
                try {
                    var bid = Level.getTile(x, y, z);
                    if (bid == 154) {
                        var dx = x - myX(), dy = y - myY(), dz = z - myZ();
                        hopperFound.push([x, y, z, Math.sqrt(dx*dx + dy*dy + dz*dz)]);
                    }
                } catch(e) {}
            }
        }
    }
    for (var i = 0; i < hopperFound.length; i++) {
        var h = hopperFound[i];
        clientMessage("§e[Tolva] §fX=" + h[0] + " Y=" + h[1] + " Z=" + h[2] + " -- " + Math.round(h[3]) + "m");
    }
    clientMessage(hopperFound.length === 0 ? "§7No hay tolvas en " + radius + " bloques" : "§e" + hopperFound.length + " tolvas encontradas");
}

function refreshOverlay() {
    if (!espOverlayOn) return;
    var lines = "[MX] ESP\n";
    var pCount = 0;

    if (espOverlayOn) {
        var players = Server.getAllPlayers();
        for (var i = 0; i < players.length; i++) {
            if (players[i] == myEnt()) continue;
            var d = getPlayerDistance(players[i]);
            if (d <= 100) {
                lines += "  " + Player.getName(players[i]) + " " + Math.round(d) + "m\n";
                pCount++;
            }
        }
    }
    if (chestFound.length > 0) {
        lines += "\nCofres: " + chestFound.length + "\n";
        for (var j = 0; j < Math.min(chestFound.length, 5); j++) {
            lines += "  " + chestFound[j][4] + " X=" + chestFound[j][0] + " Y=" + chestFound[j][1] +
                " Z=" + chestFound[j][2] + " (" + Math.round(chestFound[j][3]) + "m)\n";
        }
    }
    if (hopperFound.length > 0) {
        lines += "\nTolvas: " + hopperFound.length + "\n";
        for (var k = 0; k < Math.min(hopperFound.length, 5); k++) {
            lines += "  Tolva X=" + hopperFound[k][0] + " Y=" + hopperFound[k][1] +
                " Z=" + hopperFound[k][2] + " (" + Math.round(hopperFound[k][3]) + "m)\n";
        }
    }
    if (pCount == 0 && chestFound.length == 0 && hopperFound.length == 0) lines += "\n  Nada detectado";
    updateESPOverlay(lines);
}

// performAttack — sin teleportacion, solo baja HP
function performAttack(target) {
    try {
        var hp = Entity.getHealth(target);
        if (hp > 0) Entity.setHealth(target, Math.max(0, hp - 2));
    } catch(e) {}
}

// ============================================================
//  MOD TICK
// ============================================================
function modTick() {
    var me = myEnt();

    // AUTO SPAWN / AUTO KILL
    try {
        var ownHp = Entity.getHealth(me);
        if (ownHp >= 8) autoSpawnArmed = true;
        if (ownHp >= 4) autoKillArmed = true;

        if (autoKillOn && ownHp < 4 && autoKillArmed) {
            autoKillArmed = false;
            Server.sendChat("/kill");
            clientMessage("§cAuto Kill: /kill enviado");
        } else if (autoSpawnOn && ownHp < 8 && autoSpawnArmed) {
            autoSpawnArmed = false;
            Server.sendChat("/spawn");
            clientMessage("§eAuto Spawn: /spawn enviado");
        }
    } catch(e) {}

    // PLAYER DETECT
    if (playerDetectOn) {
        detectTick--;
        if (detectTick <= 0) {
            detectTick = 10;
            var players = Server.getAllPlayers();
            for (var i = 0; i < players.length; i++) {
                if (players[i] == me) continue;
                var dist = getPlayerDistance(players[i]);
                if (dist <= 20) { ModPE.showTipMessage("§cJugador a " + Math.round(dist) + " bloques"); break; }
            }
        }
    }

    // FIND CHEST AUTO
    if (findChestOn) {
        chestScanTick--;
        if (chestScanTick <= 0) { chestScanTick = 100; scanChests(30); refreshOverlay(); }
    }

    // FIND HOPPER AUTO
    if (findHopperOn) {
        hopperScanTick--;
        if (hopperScanTick <= 0) { hopperScanTick = 100; scanHoppers(30); refreshOverlay(); }
    }

    // ESP REFRESH
    if (espOverlayOn) {
        var espTick = modTick.espRefresh || 0;
        espTick--;
        if (espTick <= 0) { espTick = 10; refreshOverlay(); }
        modTick.espRefresh = espTick;
    }

    // DISTANCE FLOAT
    if (distFloatOn && distFloatTarget != null) {
        var dfTick = modTick.dfRefresh || 0;
        dfTick--;
        if (dfTick <= 0) {
            dfTick = 10;
            try {
                updateDistFloat(Player.getName(distFloatTarget) + "\n" + Math.round(getPlayerDistance(distFloatTarget)) + " m");
            } catch(e) { distFloatOn = false; distFloatTarget = null; clearDistFloat(); }
        }
        modTick.dfRefresh = dfTick;
    }

    // TIP DISTANCIA
    if (tipDistOn && selectedPlayer != null) {
        tipDistTick--;
        if (tipDistTick <= 0) {
            tipDistTick = 10;
            try {
                ModPE.showTipMessage("§d" + selectedPlayerName + " -- " + Math.round(getPlayerDistance(selectedPlayer)) + "m");
            } catch(e) { tipDistOn = false; }
        }
    }

    // TIP COORDS
    if (tipCoordsOn && selectedPlayer != null) {
        tipCoordsTick--;
        if (tipCoordsTick <= 0) {
            tipCoordsTick = 10;
            try {
                ModPE.showTipMessage("§d" + selectedPlayerName +
                    " X=" + Math.round(Entity.getX(selectedPlayer)) +
                    " Y=" + Math.round(Entity.getY(selectedPlayer)) +
                    " Z=" + Math.round(Entity.getZ(selectedPlayer)));
            } catch(e) { tipCoordsOn = false; }
        }
    }

    // FLY
    if (flyOn) {
        try {
            var yaw = Entity.getYaw(me), pitch = Entity.getPitch(me);
            var DEG = Math.PI / 180, speed = 1.8;
            Entity.setVelX(me, Math.cos((yaw + 90) * DEG) * Math.cos(pitch * DEG) * speed);
            Entity.setVelY(me, -Math.sin(pitch * DEG) * speed);
            Entity.setVelZ(me, Math.sin((yaw + 90) * DEG) * Math.cos(pitch * DEG) * speed);
        } catch(e) {}
    }

    // NO-FALL
    if (noFallOn) {
        try { Entity.setVelY(me, Math.max(Entity.getVelY(me), 0)); } catch(e) {}
    }

    // GOD MODE
    if (godModeOn) {
        try { if (Entity.getHealth(me) < 10) Entity.setHealth(me, 20); } catch(e) {}
    }

    // KILL AURA
    if (killAuraOn) {
        try {
            var players2 = Server.getAllPlayers();
            for (var i = 0; i < players2.length; i++) {
                if (players2[i] == me) continue;
                if (getPlayerDistance(players2[i]) <= killAuraRange) {
                    if (stealthKillOn) {
                        var hp2 = Entity.getHealth(players2[i]);
                        Entity.setHealth(players2[i], Math.max(0, hp2 - 2));
                    } else {
                        Entity.setHealth(players2[i], 0);
                    }
                }
            }
        } catch(e) {}
    }

    // HITBOX EXPAND
    if (hitboxOn) {
        try {
            var target = Player.getPointedEntity();
            if (target != -1) {
                Entity.setCollisionSize(target, hitboxSize, hitboxSize * 1.25);
            }
        } catch(e) {}
    }

    // AUTO ATTACK
    if (autoAttackOn) {
        autoAttackTick--;
        if (autoAttackTick <= 0) {
            autoAttackTick = autoAttackDelay;
            try {
                var players3 = Server.getAllPlayers();
                for (var i = 0; i < players3.length; i++) {
                    if (players3[i] == me) continue;
                    if (getPlayerDistance(players3[i]) <= autoAttackRange) {
                        performAttack(players3[i]);
                        break;
                    }
                }
            } catch(e) {}
        }
    }

    // ANTI-ANTI-JAK / SLOW WALK
    if (antiJakOn || slowWalkOn) {
        jakCheckTick--;
        if (jakCheckTick <= 0) {
            jakCheckTick = 40;
            try {
                var vx = Entity.getVelX(me), vy = Entity.getVelY(me), vz = Entity.getVelZ(me);
                var totalSpeed = Math.sqrt(vx*vx + vy*vy + vz*vz);
                var limit = slowWalkOn ? maxVelocity : 4.0;
                if (totalSpeed > limit) {
                    var ratio = limit / totalSpeed;
                    Entity.setVelX(me, vx * ratio);
                    Entity.setVelY(me, vy * ratio);
                    Entity.setVelZ(me, vz * ratio);
                }
            } catch(e) {}
            try {
                if (Entity.getHealth(me) <= 0 && godModeOn) {
                    Entity.setHealth(me, 20);
                    Entity.setVelX(me, 0); Entity.setVelY(me, 0.5); Entity.setVelZ(me, 0);
                    clientMessage("§dAntiJak: Re-spawn auto");
                }
            } catch(e) {}
        }
    }
}

// ============================================================
//  EVENTOS
// ============================================================
function newLevel() {
    refreshPlayerSnapshot();
    if (typeof menuBtn == "function") menuBtn();
}

function joinServer(host, port) {
    refreshPlayerSnapshot();
    if (typeof menuBtn == "function") menuBtn();
}

function deathHook(victim, attacker) {
    if (victim == myEnt() && godModeOn) {
        Entity.setHealth(myEnt(), 20);
        Entity.setVelX(myEnt(), 0);
        Entity.setVelY(myEnt(), 0.5);
        Entity.setVelZ(myEnt(), 0);
        clientMessage("§dGod Mode: Re-spawn automatico");
    }
}

ModPE.langEdit("menu.copyright", "§dModz X §fV50");

// El loader ya validó la sesión; solo se muestra el menú.
if (typeof menuBtn == "function") menuBtn();
