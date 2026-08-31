import React, { useEffect, useRef } from 'react';
import './JourneyPage.scss';
import img from '../../../assets/images/home/newhero.jpeg';

const journeyPoints = [
    {
        id: 1,
        name: 'AYODHYA',
        subtitle: 'The Eternal Abode of Lord Shri Ram',
        hindi: 'अयोध्या',
        chapter: 'I',
        shortDesc: 'Ayodhya, the sacred birthplace of Lord Shri Ram, stands as the heart of devotion and righteousness. Blessed by the divine presence of Maryada Purushottam Shri Ram, this holy city resonates with the eternal chants of "Jai Shri Ram." Nestled on the banks of the sacred Sarayu River, Ayodhya symbolizes purity, dharma, and the triumph of good over evil.',
        quote: 'जय श्री राम',
        quoteEng: 'Victory to Lord Ram',
        accent: '#c9a84c',
        accentRgb: '201,168,76',
        tag: 'Origin'
    },
    {
        id: 2,
        name: 'MITHILA',
        subtitle: 'The Sacred Land of Maa Janaki',
        hindi: 'मिथिला',
        chapter: 'II',
        shortDesc: 'Mithila is the divine birthplace of Maa Sita, lovingly worshipped as Janaki and Vaidehi. Born to King Janak, she is revered as an incarnation of Goddess Lakshmi and the eternal embodiment of purity, devotion, and sacrifice. The sacred soil of Mithila witnessed the divine union of Shri Ram and Maa Sita, a union that symbolizes the perfect balance of dharma and devotion.',
        quote: 'सीता राम',
        quoteEng: 'Sita and Ram — divine union',
        accent: '#d4a0c8',
        accentRgb: '212,160,200',
        tag: 'Union'
    },
    {
        id: 3,
        name: 'DANDAKARANYA',
        subtitle: 'The Forest Where Dharma Was Tested',
        hindi: 'दण्डकारण्य',
        chapter: 'III',
        shortDesc: 'Dandakaranya was far more than a wilderness—it was the sacred ground where Lord Shri Ram\'s divine mission unfolded during exile. Through dense forests and dangerous terrain, Shri Ram, Maa Sita, and Lakshman journeyed with unwavering faith and courage. Every step taken by Shri Ram sanctified the land and transformed hardship into a timeless lesson of perseverance and righteousness.',
        quote: 'वनवास की तपस्या',
        quoteEng: 'The penance of exile',
        accent: '#7ab87a',
        accentRgb: '122,184,122',
        tag: 'Exile'
    },
    {
        id: 4,
        name: 'KISHKINDHA',
        subtitle: 'The Birthplace of Divine Friendship and Devotion',
        hindi: 'किष्किन्धा',
        chapter: 'IV',
        shortDesc: 'Kishkindha marks one of the most powerful turning points in the Ramayana. It was here that Lord Shri Ram met Lord Hanuman, creating an eternal bond between the Divine and His greatest devotee. The kingdom witnessed the fall of Bali, the rise of Sugriva, and the formation of the mighty Vanara Sena. Kishkindha became the foundation from which the battle against evil would begin.',
        quote: 'हनुमान प्रणाम',
        quoteEng: 'The devotion of Hanuman',
        accent: '#e8b84b',
        accentRgb: '232,184,75',
        tag: 'Alliance'
    },
    {
        id: 5,
        name: 'ASHOK VATIKA',
        subtitle: 'The Garden of Unbreakable Faith',
        hindi: 'अशोक वाटिका',
        chapter: 'V',
        shortDesc: 'Ashok Vatika stands as a sacred symbol of devotion amidst suffering. Though held captive by Ravana, Maa Sita remained steadfast in her faith and unwavering in her devotion to Shri Ram. Beneath the Ashoka trees, she endured hardship with dignity and spiritual strength. It was here that Lord Hanuman delivered Shri Ram\'s message and ring, bringing hope to Maa Sita and marking the beginning of Lanka\'s downfall.',
        quote: 'सीता की अटल भक्ति',
        quoteEng: 'The unshakable faith of Sita',
        accent: '#d4956a',
        accentRgb: '212,149,106',
        tag: 'Faith'
    },
    {
        id: 6,
        name: 'RAMESWARAM',
        subtitle: 'Where Faith Built a Bridge to Victory',
        hindi: 'रामेश्वरम्',
        chapter: 'VI',
        shortDesc: 'Rameswaram is the sacred land where Lord Shri Ram worshipped Lord Shiva before embarking on the final battle against Ravana. Standing before the vast ocean, Shri Ram demonstrated humility, devotion, and determination in his quest to restore dharma. It was from this holy land that the legendary Ram Setu was constructed by the Vanara Sena, creating a bridge of destiny to Lanka.',
        quote: 'राम सेतु',
        quoteEng: 'The bridge built on faith',
        accent: '#4cb8d4',
        accentRgb: '76,184,212',
        tag: 'Faith'
    },
    {
        id: 7,
        name: 'SANJEEVANI',
        subtitle: 'The Mountain of Miraculous Hope',
        hindi: 'संजीवनी पर्वत',
        chapter: 'VII',
        shortDesc: 'The story of Sanjeevani represents one of the greatest acts of devotion in the Ramayana. When Lakshman was gravely wounded during the war in Lanka, Lord Hanuman undertook an extraordinary journey to bring the life-saving Sanjeevani herb. Unable to identify the exact plant, he lifted the entire mountain and carried it.',
        quote: 'हनुमान की भक्ति',
        quoteEng: 'The devotion of Hanuman',
        accent: '#6ab4d4',
        accentRgb: '106,180,212',
        tag: 'Miracle'
    },
    {
        id: 8,
        name: 'LANKA',
        subtitle: 'The Battlefield of Dharma and Adharma',
        hindi: 'लङ्का',
        chapter: 'VIII',
        shortDesc: 'Lanka was the magnificent kingdom ruled by Ravana, where the final chapter of the Ramayana unfolded. It was here that the greatest battle between righteousness and evil took place. The war witnessed unparalleled acts of courage, sacrifice, and devotion from Shri Ram, Lakshman, Hanuman, and the Vanara Sena. With the defeat of Ravana, dharma triumphed over adharma, restoring balance to the world.',
        quote: 'रावण वध',
        quoteEng: 'The victory of light over darkness',
        accent: '#d46a6a',
        accentRgb: '212,106,106',
        tag: 'Victory'
    },
];

export default function JourneyPage() {
    const wrapRef = useRef(null);
    const pinRef = useRef(null);
    const trackRef = useRef(null);
    const hudRef = useRef(null);

    useEffect(() => {
        let ctx;

        const loadAndInit = async () => {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');

            const { gsap, ScrollTrigger } = window;
            gsap.registerPlugin(ScrollTrigger);

            ctx = gsap.context(() => {

                // ─────────────────────────────────────────────────────────
                // 1. HERO
                // ─────────────────────────────────────────────────────────
                gsap.timeline({ delay: 0.2 })
                    .set('.jrny-eyebrow', { y: 24, opacity: 0 })
                    .set('.jrny-hero-word', { y: 90, opacity: 0 })
                    .set('.jrny-hero-rule', { scaleX: 0, opacity: 1 })
                    .set('.jrny-hero-sub', { y: 16, opacity: 0 })
                    .set('.jrny-scroll-cue', { opacity: 0 })
                    .to('.jrny-eyebrow', { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' })
                    .to('.jrny-hero-word', { y: 0, opacity: 1, stagger: 0.14, duration: 1.2, ease: 'power4.out' }, '-=0.4')
                    .to('.jrny-hero-rule', { scaleX: 1, duration: 0.9, ease: 'expo.inOut' }, '-=0.4')
                    .to('.jrny-hero-sub', { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
                    .to('.jrny-scroll-cue', { opacity: 1, duration: 0.6 }, '-=0.1');

                gsap.to('.jrny-mandala-a', { rotation: 360, duration: 100, ease: 'none', repeat: -1 });
                gsap.to('.jrny-mandala-b', { rotation: -360, duration: 70, ease: 'none', repeat: -1 });

                gsap.to('.jrny-hero-bg', {
                    yPercent: 28, ease: 'none',
                    scrollTrigger: { trigger: '.jrny-hero', start: 'top top', end: 'bottom top', scrub: true },
                });

                // ─────────────────────────────────────────────────────────
                // 2. HORIZONTAL PIN + SLIDE
                // ─────────────────────────────────────────────────────────
                const track = trackRef.current;
                const panels = gsap.utils.toArray('.jrny-slide');

                const hTween = gsap.to(track, {
                    x: () => -(track.scrollWidth - window.innerWidth),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: pinRef.current,
                        pin: true,
                        scrub: 1,
                        start: 'top 82px',
                        end: () => `+=${track.scrollWidth - window.innerWidth - 82}`,
                        invalidateOnRefresh: true,
                        anticipatePin: 1,
                        // Show the HUD counter only while the pinned slider is active,
                        // hide it before (hero) and after (end section) it.
                        onEnter: () => gsap.to(hudRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' }),
                        onLeave: () => gsap.to(hudRef.current, { opacity: 0, duration: 0.35, ease: 'power2.out' }),
                        onEnterBack: () => gsap.to(hudRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' }),
                        onLeaveBack: () => gsap.to(hudRef.current, { opacity: 0, duration: 0.35, ease: 'power2.out' }),
                    },
                });

                // Progress bar tied to horizontal scroll
                gsap.to('.jrny-prog-fill', {
                    scaleX: 1, ease: 'none',
                    scrollTrigger: {
                        trigger: pinRef.current,
                        start: 'top top',
                        end: () => `+=${track.scrollWidth - window.innerWidth}`,
                        scrub: true,
                    },
                });

                // ── Per-slide animations
                panels.forEach((slide, i) => {
                    const point = journeyPoints[i];

                    const chap = slide.querySelector('.jslide-chapter');
                    const tag = slide.querySelector('.jslide-tag');
                    const num = slide.querySelector('.jslide-num');
                    const name = slide.querySelector('.jslide-name');
                    const hndi = slide.querySelector('.jslide-hindi');
                    const rule = slide.querySelector('.jslide-rule');
                    const desc = slide.querySelector('.jslide-desc');
                    const quot = slide.querySelector('.jslide-quote');
                    const bgTxt = slide.querySelector('.jslide-bg-text');
                    const imgEl = slide.querySelector('.jslide-img');

                    gsap.set([chap, tag, name, hndi, desc, quot], { opacity: 0, y: 36 });
                    gsap.set(rule, { scaleX: 0, opacity: 1 });
                    gsap.set(num, { opacity: 0, scale: 0.4 });
                    gsap.set(bgTxt, { opacity: 0, scale: 0.85 });

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: slide,
                            containerAnimation: hTween,
                            start: 'left 75%',
                            toggleActions: 'play none none reverse',
                        }
                    });

                    tl.to(bgTxt, { opacity: 0.06, scale: 1, duration: 1.2, ease: 'power2.out' }, 0)
                        .to(imgEl, { scale: 1, duration: 1.4, ease: 'power2.out' }, 0)
                        .to(num, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, 0.1)
                        .to(chap, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.15)
                        .to(tag, { opacity: 1, y: 0, duration: 0.45, ease: 'back.out(2)' }, 0.25)
                        .to(name, { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out' }, 0.3)
                        .to(hndi, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.45)
                        .to(rule, { scaleX: 1, duration: 0.6, ease: 'expo.inOut' }, 0.55)
                        .to(desc, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.65)
                        .to(quot, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.8);

                    gsap.fromTo(imgEl,
                        { scale: 1.18 },
                        {
                            scale: 1,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: slide,
                                containerAnimation: hTween,
                                start: 'left right',
                                end: 'right left',
                                scrub: true,
                            }
                        }
                    );

                    ScrollTrigger.create({
                        trigger: slide,
                        containerAnimation: hTween,
                        start: 'left 55%',
                        onEnter: () => activateDot(i),
                        onEnterBack: () => activateDot(i),
                    });
                });

                // Particles
                gsap.utils.toArray('.jrny-ptcl').forEach((p, i) => {
                    gsap.to(p, {
                        y: -(80 + (i % 5) * 18),
                        x: (i % 2 === 0 ? 1 : -1) * (12 + i * 4),
                        opacity: 0,
                        duration: 3 + (i % 4),
                        ease: 'power1.out',
                        repeat: -1,
                        delay: i * 0.3,
                    });
                });

                // End section
                gsap.from('.jrny-end > *', {
                    y: 60, opacity: 0, stagger: 0.14, duration: 1.1, ease: 'power3.out',
                    scrollTrigger: { trigger: '.jrny-end', start: 'top 75%', toggleActions: 'play none none reverse' },
                });

            }, wrapRef);
        };

        loadAndInit();
        return () => {
            ctx?.revert();
            window.ScrollTrigger?.getAll().forEach(t => t.kill());
        };
    }, []);

    const activateDot = (i) => {
        document.querySelectorAll('.jtrail-dot').forEach((d, idx) => {
            d.classList.toggle('active', idx <= i);
        });
        const el = document.querySelector('.jrny-count-cur');
        if (el) el.textContent = String(i + 1).padStart(2, '0');
    };

    return (
        <div className="jrny-wrap" ref={wrapRef}>

            <div className="jrny-prog-bar"><div className="jrny-prog-fill" /></div>

            <div className="jrny-hud" ref={hudRef}>
                <span className="jrny-count-cur">01</span>
                <span className="jrny-count-sep">/</span>
                <span className="jrny-count-tot">08</span>
            </div>

            <div className="jrny-ptcls" aria-hidden="true">
                {Array.from({ length: 16 }).map((_, i) => (
                    <span key={i} className="jrny-ptcl"
                        style={{ left: `${(i * 13 + 5) % 94}%`, top: `${(i * 19 + 8) % 88}%` }}>
                        {['✦', '◆', '✿', '❋', '⟡'][i % 5]}
                    </span>
                ))}
            </div>

            {/* HERO SECTION */}
            <section className="jrny-hero">
                <div className="jrny-hero-bg" />

                <div className="jrny-hero-mandalas" aria-hidden="true">
                    <svg className="jrny-mandala-a" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                        {[260, 210, 160, 110, 60].map((r, i) => (
                            <circle key={i} cx="300" cy="300" r={r} fill="none" stroke="currentColor"
                                strokeWidth="0.7" strokeDasharray={i % 2 === 0 ? undefined : '3 7'} />
                        ))}
                        {Array.from({ length: 16 }).map((_, i) => (
                            <line key={i} x1="300" y1="10" x2="300" y2="590"
                                transform={`rotate(${i * 22.5},300,300)`} stroke="currentColor" strokeWidth="0.35" />
                        ))}
                    </svg>
                    <svg className="jrny-mandala-b" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <polygon key={i} points="200,45 208,196 200,355 192,196"
                                transform={`rotate(${i * 45},200,200)`} fill="none" stroke="currentColor" strokeWidth="0.5" />
                        ))}
                        {[140, 90, 40].map((r, i) => (
                            <circle key={i} cx="200" cy="200" r={r} fill="none" stroke="currentColor" strokeWidth="0.5" />
                        ))}
                    </svg>
                </div>

                <div className="jrny-hero-vignette" />

                <div className="jrny-hero-content">
                    <p className="jrny-eyebrow">
                        <span className="jrny-dash" />Sacred Pilgrimage<span className="jrny-dash" />
                    </p>
                    <h1 className="jrny-hero-title">
                        <span className="jrny-word-row"><span className="jrny-hero-word">THE</span></span>
                        <span className="jrny-word-row"><span className="jrny-hero-word gold">DIVINE</span></span>
                        <span className="jrny-word-row"><span className="jrny-hero-word">JOURNEY</span></span>
                    </h1>
                    <div className="jrny-hero-rule" />
                    <p className="jrny-hero-sub">
                        Eight sacred lands &nbsp;·&nbsp; One eternal truth
                    </p>
                </div>

                <div className="jrny-scroll-cue">
                    <div className="jrny-scroll-track">
                        <div className="jrny-scroll-thumb" />
                    </div>
                    <span>Begin the Journey</span>
                </div>
            </section>

            {/* HORIZONTAL PIN CONTAINER */}
            <div className="jrny-pin-outer" ref={pinRef}>

                <div className="jtrail">
                    {journeyPoints.map((pt, i) => (
                        <div key={i} className="jtrail-item">
                            <div className="jtrail-dot" />
                            <span className="jtrail-label">{pt.name.split(' ')[0]}</span>
                        </div>
                    ))}
                </div>

                <div className="jrny-track" ref={trackRef}>
                    {journeyPoints.map((pt, idx) => (
                        <div key={pt.id} className="jrny-slide"
                            style={{ '--pa': pt.accent, '--par': pt.accentRgb }}>

                            <div className="jslide-media">
                                <div className="jslide-img" style={{ backgroundImage: `url(${img})` }} />
                                <div className="jslide-media-scrim" />
                                <div className="jslide-media-glow" />
                            </div>

                            <div className="jslide-bg-text" aria-hidden="true">{pt.hindi}</div>

                            <div className="jslide-content">
                                <div className="jslide-top-row">
                                    <span className="jslide-chapter">Chapter {pt.chapter}</span>
                                    <span className="jslide-tag">{pt.tag}</span>
                                </div>

                                <div className="jslide-name-block">
                                    <h2 className="jslide-name">{pt.name}</h2>
                                    <p className="jslide-hindi">{pt.hindi}</p>
                                </div>

                                <div className="jslide-rule" />

                                <p className="jslide-desc">{pt.shortDesc}</p>

                                <div className="jslide-quote">
                                    <span className="jslide-quote-icon">❝</span>
                                    <p className="jslide-quote-hi">{pt.quote}</p>
                                    <p className="jslide-quote-en">{pt.quoteEng}</p>
                                </div>
                            </div>

                            <div className="jslide-num">{String(pt.id).padStart(2, '0')}</div>
                            <div className="jslide-accent-bar" />
                        </div>
                    ))}
                </div>
            </div>

            {/* END SECTION */}
            <section className="jrny-end">
                <div className="jrny-end-mandala" aria-hidden="true">
                    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                        {[200, 155, 110, 65].map((r, i) => (
                            <circle key={i} cx="250" cy="250" r={r} fill="none" stroke="currentColor"
                                strokeWidth="0.7" strokeDasharray={i % 2 === 0 ? undefined : '3 8'} />
                        ))}
                        {Array.from({ length: 12 }).map((_, i) => (
                            <line key={i} x1="250" y1="50" x2="250" y2="450"
                                transform={`rotate(${i * 30},250,250)`} stroke="currentColor" strokeWidth="0.4" />
                        ))}
                    </svg>
                </div>
                <div className="jrny-end-om">🕉️</div>
                <p className="jrny-end-eyebrow">The Journey Ends — The Truth Remains</p>
                <h2 className="jrny-end-shloka">धर्मो रक्षति रक्षितः</h2>
                <div className="jrny-end-orn">
                    <span className="jrny-orn-l" />
                    <svg width="11" height="7" viewBox="0 0 14 8">
                        <polygon points="7,0 14,4 7,8 0,4" fill="currentColor" />
                    </svg>
                    <span className="jrny-orn-r" />
                </div>
                <p className="jrny-end-trans">Dharma protects those who protect Dharma</p>
                <p className="jrny-end-footer">जय श्री राम &nbsp;·&nbsp; Jai Shri Ram</p>
            </section>

        </div>
    );
}

function loadScript(src) {
    return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement('script');
        s.src = src; s.onload = resolve;
        document.head.appendChild(s);
    });
}