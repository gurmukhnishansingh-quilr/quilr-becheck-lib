async function checkbrowserextension(quilrurl, redirecturl, tenant) {
    let mdmRedirect = true;
    let mdmAllowBypass = false;

    try {
        const res = await fetch(quilrurl+'/bff/browser-extension/browser/extension/deployment/mdm/details', {
            method: 'GET',
            headers: {
                'tenant': tenant
            }
        });
        if (res.ok) {
            const data = await res.json();
            if ('mdmRedirect' in data) mdmRedirect = data.mdmRedirect;
            if ('mdmAllowBypass' in data) mdmAllowBypass = data.mdmAllowBypass;
        } else {
            console.warn('Failed to fetch quilrurl:', res.status);
        }
    } catch (err) {
        console.warn('Error fetching quilrurl:', err);
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('quilrExtensionBypass') != null && sessionStorage.getItem('quilrExtensionBypass') === null) {
        sessionStorage.setItem('quilrExtensionBypass', params.get('quilrExtensionBypass'));
    }
    if (sessionStorage.getItem('quilrExtensionBypass') !== 'true') {
        if (mdmRedirect) {
            console.log("check Quilr Extension Exist");
            var extPresent = window.quilrExtensionPresent === true;
            var extToken = typeof window.quilrExtensionToken === 'string' && window.quilrExtensionToken.length > 0;
            if (!extPresent || !extToken) {
                // console.log("redirect to quilr page");
                window.location.href = redirecturl + '/?redirect_url=' + encodeURIComponent(window.location.href)+'&bypass='+mdmAllowBypass+'&redirect='+mdmRedirect;
            }
        } else {
            console.log("mdmRedirect is false, skipping redirect.");
        }
    }
}
