"""Run inside browser-harness: exec(open('tests/browser-flow.py').read()); run('catalogue')."""
import json
import time
from pathlib import Path

BASE = 'http://localhost:3001'
OUT = Path('E:/Webgrow/Uplove/artifacts')

def click(role, name, exact=True):
    nodes = cdp('Accessibility.getFullAXTree')['nodes']
    matches = [n for n in nodes if n.get('role', {}).get('value') == role and (n.get('name', {}).get('value', '').casefold() == name.casefold() if exact else name.casefold() in n.get('name', {}).get('value', '').casefold()) and not n.get('ignored')]
    assert matches, (role, name)
    node = matches[0]['backendDOMNodeId']
    cdp('DOM.scrollIntoViewIfNeeded', backendNodeId=node)
    q = cdp('DOM.getBoxModel', backendNodeId=node)['model']['content']
    cdp('Page.bringToFront')
    cdp('Input.dispatchMouseEvent',type='mouseMoved',x=sum(q[0::2])/4,y=sum(q[1::2])/4)
    click_at_xy(sum(q[0::2]) / 4, sum(q[1::2]) / 4)
    time.sleep(.45)

def go(path):
    goto_url(BASE + path)
    wait_for_load()
    time.sleep(.7)

def check(expression, label):
    assert js(expression), label
    print('PASS', label, flush=True)

def select(name, value):
    values = js('Array.from(document.querySelector(' + json.dumps('select[aria-label="' + name + '"]') + ').options).map(o=>o.value)')
    click('combobox', name)
    press_key('Home')
    for _ in range(values.index(value)):
        press_key('ArrowDown')
    press_key('Enter')
    time.sleep(.6)

def snapshot(name):
    js("document.querySelectorAll('img').forEach(i=>i.loading='eager')")
    for _ in range(20):
        if js('Array.from(document.images).every(i=>i.complete)'):
            break
        time.sleep(.2)
    check('Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)', name + ' images')
    check('document.documentElement.scrollWidth<=innerWidth', name + ' no overflow')
    capture_screenshot(str(OUT / (name + '.png')), full=True)

def run(phase):
    cdp('Runtime.enable')
    cdp('Log.enable')
    cdp('Network.enable')
    drain_events()
    if phase == 'catalogue':
        cdp('Emulation.setDeviceMetricsOverride', width=1440, height=900, deviceScaleFactor=1, mobile=False)
        go('/products')
        check('document.querySelectorAll("article").length===20', '20 products per page')
        snapshot('products-1440')
        fill_input('#catalogue-search', 'Nirmala')
        press_key('Enter'); time.sleep(.6)
        check('document.querySelectorAll("article").length===1&&document.querySelector("article h3").textContent.includes("Nirmala")', 'catalogue search')
        fill_input('#catalogue-search', 'no-such-garment')
        press_key('Enter'); time.sleep(.6)
        check('document.querySelectorAll("article").length===0&&document.body.innerText.includes("Belum ada pilihan")', 'search empty state')
        go('/products')
        select('Urutkan produk', 'price-asc')
        prices=js('Array.from(document.querySelectorAll("article p")).map(e=>Number(e.textContent.replace(/[^0-9]/g,"")))')
        assert prices==sorted(prices), prices
        print('PASS sorting price ascending',flush=True)
        select('Filter ukuran', 'XL')
        check('location.search.includes("size=XL")&&document.querySelectorAll("article").length>0', 'size filter')
        select('Filter warna', 'Ivory')
        check('location.search.includes("color=Ivory")&&document.querySelectorAll("article").length>0', 'combined color filter')
        go('/products')
        click('link', 'Halaman 2')
        check('location.search.includes("page=2")&&document.querySelectorAll("article").length===20', 'pagination')
        go('/category/dress')
        check('document.querySelector("h1").textContent==="Dress"', 'dress category')
        click('button', 'Filter')
        check('!!document.querySelector("[role=dialog]")', 'category filter sheet')
        press_key('Escape')
        go('/category/__proto__')
        check('document.body.innerText.includes("Halaman tidak ditemukan")', 'prototype slug rejected')
        go('/')
        click('button', 'Buka koleksi DRESS')
        check('Array.from(document.querySelectorAll("button")).find(b=>b.getAttribute("aria-label")==="Buka koleksi DRESS").getAttribute("aria-expanded")==="true"', 'desktop dropdown')
        press_key('Escape')
        click('button', 'Buka pencarian')
        fill_input('#header-search', 'Aluna')
        check('document.querySelectorAll("#header-search").length===1&&document.body.innerText.toLowerCase().includes("lihat semua hasil")', 'header search suggestions')
        press_key('Enter'); time.sleep(.5)
        check('location.pathname==="/products"&&location.search.includes("Aluna")', 'header search navigation')
    elif phase == 'shopping':
        go('/products/aluna-ivory-kebaya')
        js("['uplove-cart-v1','uplove-wishlist-v1','uplove-orders-v1'].forEach(k=>localStorage.removeItem(k))")
        go('/products/aluna-ivory-kebaya')
        click('button','Tampilkan foto 2 Aluna Ivory Kebaya')
        check('Array.from(document.querySelectorAll("button")).find(b=>b.getAttribute("aria-label")==="Tampilkan foto 2 Aluna Ivory Kebaya").getAttribute("aria-pressed")==="true"', 'product thumbnails')
        click('button','Perbesar foto Aluna Ivory Kebaya')
        check('document.querySelector("[role=dialog]").getBoundingClientRect().height>500&&document.querySelector("[role=dialog] img").getBoundingClientRect().height>300','product zoom dimensions')
        press_key('ArrowRight'); press_key('Escape')
        check('document.activeElement.getAttribute("aria-label")==="Perbesar foto Aluna Ivory Kebaya"','zoom restores focus')
        click('button','DRESS & KEBAYA SIZE CHART')
        check('!!document.querySelector("[role=dialog] table")','size chart')
        press_key('Escape')
        click('radio','M')
        click('button','Pilih warna Ivory')
        check('!document.querySelector("input[name=size]:checked")','color selection resets size')
        click('radio','M')
        click('button','Tambah jumlah')
        click('button','SIMPAN KE WISHLIST')
        click('button','TAMBAH KE KERANJANG')
        check('document.querySelector("[role=dialog]").innerText.includes("Keranjang (2)")','add cart opens drawer')
        snapshot('cart-drawer-1440')
        click('button','Kurangi jumlah Aluna Ivory Kebaya')
        check('JSON.parse(localStorage.getItem("uplove-cart-v1"))[0].quantity===1','cart quantity persisted')
        press_key('Escape')
        check('document.activeElement.textContent.includes("TAMBAH KE KERANJANG")','cart restores opener focus')
        go('/wishlist')
        check('document.querySelectorAll("article").length===1','wishlist saved')
        go('/cart')
        check('document.body.innerText.includes("Aluna Ivory Kebaya")','cart survives refresh')
        click('button','Tambah jumlah Aluna Ivory Kebaya')
        click('button','Hapus Aluna Ivory Kebaya dari keranjang')
        check('JSON.parse(localStorage.getItem("uplove-cart-v1")).length===0','remove cart item')
        go('/checkout')
        check('document.body.innerText.includes("Keranjang Anda masih kosong")','empty checkout')
        go('/products/aluna-ivory-kebaya?size=M')
        click('button','TAMBAH KE KERANJANG')
        click('link','Lanjut ke checkout')
        time.sleep(.5)
        click('button','Buat pesanan')
        check('document.querySelectorAll("[aria-invalid=true]").length>=8','checkout required fields')
        for field,value in {'name':'Ayu Pengujian','email':'ayu@example.test','phone':'081234567890','city':'Denpasar','district':'Denpasar Selatan','postalCode':'80222','address':'Jalan Pengujian nomor 12'}.items():
            fill_input('#'+field,value)
        click('combobox','Provinsi'); press_key('Home')
        for _ in range(16): press_key('ArrowDown')
        press_key('Enter')
        check('document.querySelector("#province").value==="Bali"','province selection')
        click('radio','QRIS')
        js('window.originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==="uplove-orders-v1")throw new DOMException("Quota test","QuotaExceededError");return window.originalSetItem.call(this,k,v)}')
        click('button','Buat pesanan')
        check('location.pathname==="/checkout"&&JSON.parse(localStorage.getItem("uplove-cart-v1")).length===1&&!!document.querySelector("[role=alert]")','storage failure preserves cart')
        js('Storage.prototype.setItem=window.originalSetItem;delete window.originalSetItem')
        click('button','Buat pesanan')
        time.sleep(.8)
        check('location.pathname==="/checkout/success"&&document.body.innerText.includes("Pesanan Berhasil Dibuat")','checkout success')
        check('JSON.parse(localStorage.getItem("uplove-cart-v1")).length===0&&JSON.parse(localStorage.getItem("uplove-orders-v1")).length===1','order persisted before cart clear')
        snapshot('checkout-success-1440')
        url=js('location.pathname+location.search')
        go(url)
        check('document.body.innerText.includes("Ayu Pengujian")&&document.body.innerText.includes("Pembayaran belum dilakukan")','receipt survives refresh, no payment claim')
    elif phase == 'mobile':
        cdp('Emulation.setDeviceMetricsOverride',width=390,height=844,deviceScaleFactor=1,mobile=False)
        go('/')
        click('button','Buka menu')
        check('!!document.querySelector("[role=dialog]")','mobile menu')
        snapshot('mobile-menu-390')
        click('button','DRESS')
        click('link','Lihat Semua DRESS')
        check('location.pathname==="/category/dress"&&!document.querySelector("[role=dialog]")','mobile nested navigation')
        click('button','Filter')
        select('Filter ukuran','M')
        press_key('Escape')
        check('location.search.includes("size=M")','mobile filtering')
        go('/products/aluna-ivory-kebaya?size=M')
        click('button','TAMBAH KE KERANJANG')
        check('document.querySelector("[role=dialog]").getBoundingClientRect().width>=380','mobile cart width')
        click('link','Lanjut ke checkout')
        snapshot('checkout-390')
    events=drain_events()
    errors=[e for e in events if e.get('method')=='Runtime.exceptionThrown' or (e.get('method')=='Log.entryAdded' and e.get('params',{}).get('entry',{}).get('level')=='error' and not e.get('params',{}).get('entry',{}).get('url','').endswith('/category/__proto__'))]
    requests=[e.get('params',{}).get('request',{}) for e in events if e.get('method')=='Network.requestWillBeSent']
    assert all(r.get('url','').startswith(BASE) or r.get('url','').startswith('data:') for r in requests), 'External network request'
    (OUT / ('browser-'+phase+'.json')).write_text(json.dumps({'phase':phase,'errors':errors},ensure_ascii=False,indent=2),encoding='utf-8')
    assert not errors, errors
    print('PASS',phase,'no browser errors',flush=True)

def responsive(widths):
    rows=[]
    routes=[('/', 'home'),('/products','products'),('/category/dress','category-dress'),('/category/kebaya','category-kebaya'),('/products/aluna-ivory-kebaya','product'),('/checkout','checkout')]
    for width in widths:
        cdp('Emulation.setDeviceMetricsOverride',width=width,height=844 if width<768 else 900,deviceScaleFactor=1,mobile=False)
        for path,name in routes:
            go(path)
            snapshot(name+'-'+str(width))
            rows.append({'width':width,'route':path,'header':js('document.querySelector("header").getBoundingClientRect().height'),'columns':js('document.querySelector("article")?getComputedStyle(document.querySelector("article").parentElement).gridTemplateColumns.split(" ").length:null'),'overflow':js('document.documentElement.scrollWidth>innerWidth')})
    (OUT/('responsive-'+str(widths[0])+'.json')).write_text(json.dumps(rows,indent=2),encoding='utf-8')
    print('PASS responsive',widths,flush=True)

def information():
    cdp('Runtime.enable'); cdp('Log.enable'); drain_events()
    cdp('Emulation.setDeviceMetricsOverride',width=1440,height=900,deviceScaleFactor=1,mobile=False)
    go('/customer-gallery')
    click('button','Lihat inspirasi busana 1')
    press_key('ArrowRight')
    check('document.querySelector("[role=dialog]").innerText.includes("Inspirasi 2 dari 12")','gallery arrow navigation')
    press_key('Escape')
    check('document.activeElement.getAttribute("aria-label")==="Lihat inspirasi busana 1"','gallery focus restored')
    go('/faq')
    click('button','Bagaimana memilih ukuran yang tepat?')
    check('document.body.innerText.includes("Cocokkan lingkar dada")','FAQ accordion')
    go('/contact-us')
    click('button','Pilihan & ukuran',False)
    fill_input('#contact-name','Ayu Pengujian')
    fill_input('#contact-email','ayu@example.test')
    fill_input('#contact-message','Saya ingin membandingkan ukuran M dan L.')
    click('button','Lihat ringkasan pertanyaan')
    check('document.body.innerText.includes("Catatan Anda siap, Ayu Pengujian.")','contact local summary')
    go('/appointments')
    fill_input('#appointment-name','Ayu Pengujian')
    fill_input('#appointment-email','ayu@example.test')
    js('document.querySelector("#appointment-date").value="2027-01-15"')
    click('combobox','Kebutuhan busana');press_key('Home');press_key('Enter')
    click('button','Lihat ringkasan rencana')
    check('document.body.innerText.includes("Rencana Anda telah dirangkum.")','appointment local summary')
    go('/')
    cdp('Emulation.setEmulatedMedia',features=[{'name':'prefers-reduced-motion','value':'reduce'}])
    check('!document.querySelector("[aria-roledescription=carousel]")', 'static homepage hero')
    check('Array.from(document.querySelectorAll("main a")).filter(a=>a.textContent==="Shop Now").every(a=>parseFloat(getComputedStyle(a).transitionDuration)<=.001)','hero respects reduced motion')
    click('link','Shop Now')
    check('location.pathname==="/category/new-arrivals"','hero collection navigation')
    cdp('Emulation.setEmulatedMedia',features=[])
    for width in [1440,390]:
        cdp('Emulation.setDeviceMetricsOverride',width=width,height=900,deviceScaleFactor=1,mobile=False)
        for path in ['/about-us','/contact-us','/faq','/customer-gallery','/store-location','/appointments','/articles','/articles/merawat-kebaya-dan-detail-halus','/privacy-policy','/wishlist','/cart']:
            go(path)
            snapshot(path.strip('/').replace('/','-')+'-'+str(width))
    go('/cart')
    saved=js('localStorage.getItem("uplove-cart-v1")')
    js('localStorage.setItem("uplove-cart-v1","broken json")')
    go('/cart')
    check('document.body.innerText.includes("Keranjang Anda masih kosong")','corrupt cart recovers')
    js('localStorage.setItem("uplove-cart-v1",'+json.dumps(saved)+')')
    events=drain_events()
    errors=[e for e in events if e.get('method')=='Runtime.exceptionThrown' or (e.get('method')=='Log.entryAdded' and e.get('params',{}).get('entry',{}).get('level')=='error')]
    (OUT/'browser-information.json').write_text(json.dumps(errors,indent=2),encoding='utf-8')
    assert not errors,errors
    print('PASS information pages no browser errors',flush=True)


def homepage():
    cdp('Runtime.enable'); cdp('Log.enable'); drain_events()
    rows=[]
    for width in [1440,1280,1024,768,390,375]:
        cdp('Emulation.setDeviceMetricsOverride',width=width,height=900 if width>=768 else 844,deviceScaleFactor=1,mobile=width<768)
        go('/')
        check('Array.from(document.querySelectorAll("main section")).map(s=>s.getAttribute("aria-labelledby")).join(",")==="home-title,ready-to-wear-title,new-collections-title,ready-stock-title"','homepage section order '+str(width))
        check('document.querySelectorAll("main h1").length===1&&document.querySelectorAll("main article").length===8','homepage heading and product count '+str(width))
        check('!!document.querySelector("header")&&!!document.querySelector("footer")&&!document.querySelector("header").innerText.includes("IDR")','homepage navigation retained '+str(width))
        layout=js('''(() => {
            const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom}};
            const sections=Array.from(document.querySelectorAll('main section'));
            const products=Array.from(document.querySelectorAll('main article'));
            const editorial=sections[2];
            return {hero:rect(sections[0]),columns:getComputedStyle(products[0].parentElement).gridTemplateColumns.split(' ').length,
                portrait:rect(products[0].querySelector('img').parentElement),square:rect(products[4].querySelector('img').parentElement),
                main:rect(editorial.children[0]),secondary:rect(editorial.children[2]),copy:rect(editorial.children[3])};
        })()''')
        assert layout['columns']==(4 if width>=768 else 2),layout
        assert abs(layout['hero']['w']/layout['hero']['h']-(19/9 if width>=768 else 4/3))<.01,layout
        assert abs(layout['portrait']['w']/layout['portrait']['h']-.75)<.01,layout
        assert abs(layout['square']['w']/layout['square']['h']-1)<.01,layout
        assert abs(layout['main']['bottom']-layout['secondary']['bottom'])<1,layout
        if width<768:
            assert layout['copy']['y']>=layout['main']['bottom'],layout
        else:
            assert layout['copy']['x']>layout['secondary']['x']+layout['secondary']['w'],layout
        rows.append({'width':width,**layout})
        snapshot('home-redesign-'+str(width))
    click('button','Buka menu')
    check('!!document.querySelector("[role=dialog]")&&!document.querySelector("[role=dialog]").innerText.includes("IDR")','homepage mobile menu')
    press_key('Escape')
    click('button','Buka keranjang',exact=False)
    check('!!document.querySelector("[role=dialog]")&&document.querySelector("[role=dialog]").innerText.includes("Keranjang")','homepage mobile cart drawer')
    press_key('Escape')
    cdp('Emulation.setDeviceMetricsOverride',width=1440,height=900,deviceScaleFactor=1,mobile=False)
    go('/')
    saved=js('document.querySelector("main article button").getAttribute("aria-pressed")')
    name=js('document.querySelector("main article button").getAttribute("aria-label")')
    click('button',name)
    check('document.querySelector("main article button").getAttribute("aria-pressed")!=='+json.dumps(saved),'homepage wishlist toggles')
    click('button',js('document.querySelector("main article button").getAttribute("aria-label")'))
    check('document.querySelector("main article button").getAttribute("aria-pressed")==='+json.dumps(saved),'homepage wishlist restores')
    for label,path in [('Lihat semua Ready-to-Wear','/category/ready-to-wear'),('Lihat semua New Collections','/category/new-arrivals'),('Lihat semua Ready Stock','/category/ready-stock'),('Jelajahi koleksi Dress UpLove','/category/dress'),('Jelajahi koleksi Kebaya UpLove','/category/kebaya')]:
        go('/')
        click('link',label)
        check('location.pathname==='+json.dumps(path)+'&&!document.body.innerText.includes("Halaman tidak ditemukan")',label)
        check('Array.from(document.querySelectorAll("article")).every(a=>a.dataset.presentation==="catalogue"&&getComputedStyle(a.querySelector("img").parentElement).aspectRatio==="9 / 16")','catalogue image proportions preserved')
    go('/')
    node=next(n for n in cdp('Accessibility.getFullAXTree')['nodes'] if n.get('role',{}).get('value')=='link' and n.get('name',{}).get('value')=='Shop Now')
    cdp('DOM.focus',backendNodeId=node['backendDOMNodeId'])
    press_key('Enter');time.sleep(.6)
    check('location.pathname==="/category/new-arrivals"','hero keyboard navigation')
    go('/')
    first=js('document.querySelector("main article a").getAttribute("href")')
    click('link',js('document.querySelector("main article img").alt'),exact=False)
    check('location.pathname==='+json.dumps(first),'homepage product navigation')
    cdp('Emulation.setEmulatedMedia',features=[{'name':'prefers-reduced-motion','value':'reduce'}])
    go('/')
    check('Array.from(document.querySelectorAll("main a")).filter(a=>a.textContent==="Shop Now").every(a=>parseFloat(getComputedStyle(a).transitionDuration)<=.001)','homepage reduced motion')
    cdp('Emulation.setEmulatedMedia',features=[])
    events=drain_events()
    errors=[e for e in events if e.get('method')=='Runtime.exceptionThrown' or (e.get('method')=='Log.entryAdded' and e.get('params',{}).get('entry',{}).get('level')=='error')]
    (OUT/'home-redesign-verification.json').write_text(json.dumps({'layouts':rows,'errors':errors},indent=2),encoding='utf-8')
    assert not errors,errors
    print('PASS homepage responsive layouts, navigation, wishlist, keyboard and browser errors',flush=True)
