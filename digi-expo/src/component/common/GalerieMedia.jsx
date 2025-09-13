import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const MAIN_COLOR = "#582C83";

const translations = {
    fr: {
        headerTitle: "Digital Explorers Media",
        headerSubtitle: "Découvrez les moments forts du programme",
        articles: [
            {
                title: "Salé : Remise de certificats de formation à la 2e promotion du programme “Digital Explorers”",
                body: (
                    <>
                        <p>
                            Salé – Une cérémonie de remise de certificats de formation au profit de la 2e promotion du programme “Digital Explorers” s’est tenue, récemment à Salé, en présence de nombreux acteurs associatifs et institutionnels engagés en faveur de l’inclusion numérique.
                        </p>
                        <p>
                            Initié par DXC CDG, ce programme social destiné aux enfants (de 5 à 13 ans) issus des milieux défavorisés ou en situation de handicap, vise à les initier aux fondamentaux du codage et de l’intelligence artificielle, dans l’optique de favoriser leur inclusion numérique.
                        </p>
                        <p>
                            S’exprimant à cette occasion, Lamiaa Lahiaoui, Senior vice-présidente au sein de DXC CDG en charge de la communication interne et des moyens généraux, a indiqué que le programme Digital Explorers s’inscrit dans le cadre de l’engagement du groupe en faveur d’une société plus inclusive tournée vers l’avenir numérique.
                        </p>
                        <p>
                            “Ce programme a permis, cette année, à plus de 250 enfants inscrits dans 8 associations partenaires de bénéficier d’une formation d’un an axée sur le domaine du digital”, a-t-elle déclaré à la MAP.
                        </p>
                        <p>
                            De son côté, Meryem Bamhaouch, chargée des projets et des partenariats au sein de l’association Amicale marocaine des handicapés (AMH), a fait observer que ledit programme a permis aux enfants bénéficiaires de développer des compétences techniques en matière de développement web et de programmation.
                        </p>
                        <p>
                            “Ce programme a été d’un grand apport pour nos enfants qui ont acquis de nouvelles connaissances et compétences liées à la programmation et à l’Intelligence artificielle”, a-t-elle souligné.
                        </p>
                        <p>
                            Chaque année, Digital Explorers initie près de 150 enfants âgés de 5 à 13 ans aux fondamentaux du codage et de l’IA dans l’optique de réduire la fracture numérique dès le plus jeune âge, à la faveur d’une approche pédagogique ludique et inclusive.
                        </p>
                        <p>
                            Au-delà de l’apprentissage technologique, Digital Explorers œuvre également en faveur de la promotion des valeurs de solidarité, d’innovation et d’égalité des chances.
                        </p>
                    </>
                ),
                image: "/images/galerie-media.webp",
            },
            {
                title: "Salé : Vidéo de la cérémonie Digital Explorers",
                body: (
                    <>
                        <p>
                            Revivez la cérémonie de remise des certificats en vidéo.
                        </p>
                        <div style={{margin: "16px 0", display: "flex", justifyContent: "center"}}>
                            <div style={{width: "100%", maxWidth: 800}}>
                                <iframe
                                    width="100%"
                                    height="300"
                                    src="https://www.youtube.com/embed/S-8OvcNlddo"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </>
                ),
                image: null,
            },
        ],
    },
    en: {
        headerTitle: "Digital Explorers Media",
        headerSubtitle: "Discover the highlights of the program",
        articles: [
            {
                title: "Salé: Certificate Ceremony for the 2nd Cohort of the “Digital Explorers” Training Program",
                body: (
                    <>
                        <p>
                            Salé – A certificate ceremony for the 2nd cohort of the “Digital Explorers” program was
                            recently held in Salé, attended by numerous association and institutional actors committed
                            to digital inclusion.
                        </p>
                        <p>
                            Initiated by DXC CDG, this social program is aimed at children (aged 5 to 13) from disadvantaged backgrounds or with disabilities, introducing them to the basics of coding and artificial intelligence to promote their digital inclusion.
                        </p>
                        <p>
                            On this occasion, Lamiaa Lahiaoui, Senior Vice President at DXC CDG in charge of internal communication and general resources, stated that the Digital Explorers program is part of the group’s commitment to a more inclusive society focused on the digital future.
                        </p>
                        <p>
                            “This year, the program enabled more than 250 children enrolled in 8 partner associations to benefit from a one-year training focused on the digital field,” she told MAP.
                        </p>
                        <p>
                            For her part, Meryem Bamhaouch, project and partnership manager at the Moroccan Association of the Disabled (AMH), noted that the program allowed beneficiary children to develop technical skills in web development and programming.
                        </p>
                        <p>
                            “This program has been of great benefit to our children, who have acquired new knowledge and skills related to programming and artificial intelligence,” she emphasized.
                        </p>
                        <p>
                            Each year, Digital Explorers introduces nearly 150 children aged 5 to 13 to the basics of coding and AI, aiming to reduce the digital divide from an early age through a playful and inclusive educational approach.
                        </p>
                        <p>
                            Beyond technological learning, Digital Explorers also works to promote the values of solidarity, innovation, and equal opportunity.
                        </p>
                    </>
                ),
                image: "/images/galerie-media.webp",
            },
            {
                title: "Salé: Digital Explorers Ceremony Video",
                body: (
                    <>
                        <p>
                            Watch the certificate ceremony video.
                        </p>
                        <div style={{margin: "16px 0", display: "flex", justifyContent: "center", overflow: "visible"}}>
                            <div style={{width: "150%", maxWidth: 1200, minWidth: 400, margin: "0 auto"}}>
                                <iframe
                                    width="100%"
                                    height="300"
                                    src="https://www.youtube.com/embed/S-8OvcNlddo"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    style={{display: "block"}}
                                ></iframe>
                            </div>
                        </div>
                    </>
                ),
                image: null,
            },
        ],
    },
};

const GalerieMedia = () => {
    const {language} = useLanguage();
    const t = translations[language] || translations.fr;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f6f3fa",
                padding: "40px 0",
                fontFamily: "'Segoe UI', 'Roboto', Arial, sans-serif",
            }}
        >
            <div
                style={{
                    maxWidth: 820,
                    margin: "0 auto",
                    padding: "0 16px",
                }}
            >
                <header
                    style={{
                        textAlign: "center",
                        marginBottom: 48,
                    }}
                >
                    <h1
                        style={{
                            color: MAIN_COLOR,
                            fontSize: 40,
                            fontWeight: 900,
                            letterSpacing: 1,
                            marginBottom: 8,
                            direction: language === "ar" ? "rtl" : "ltr",
                        }}
                    >
                        {t.headerTitle}
                    </h1>
                    <div
                        style={{
                            width: 70,
                            height: 5,
                            background: MAIN_COLOR,
                            borderRadius: 3,
                            margin: "0 auto 12px auto",
                        }}
                    />
                    <p
                        style={{
                            color: "#444",
                            fontSize: 19,
                            fontWeight: 400,
                            margin: 0,
                            opacity: 0.8,
                            direction: language === "ar" ? "rtl" : "ltr",
                            textAlign: "center",
                        }}
                    >
                        {t.headerSubtitle}
                    </p>
                </header>
                <div>
                    {t.articles.map((article, idx) => (
                        <article
                            key={idx}
                            style={{
                                background: "#fff",
                                borderRadius: 20,
                                boxShadow: "0 8px 32px rgba(88,44,131,0.10)",
                                marginBottom: 48,
                                overflow: "hidden",
                                border: `1.5px solid ${MAIN_COLOR}22`,
                                padding: "0 0 24px 0",
                                transition: "box-shadow 0.2s",
                            }}
                        >
                            {article.image && (
                                <div
                                    style={{
                                        width: "100%",
                                        background: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 24,
                                        borderBottom: `1.5px solid ${MAIN_COLOR}11`,
                                    }}
                                >
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        style={{
                                            width: "100%",
                                            maxWidth: 500,
                                            height: "auto",
                                            objectFit: "contain",
                                            display: "block",
                                            borderRadius: 16,
                                            boxShadow: "0 2px 12px #582C8322",
                                            background: "#fff",
                                        }}
                                    />
                                </div>
                            )}
                            <div
                                style={{
                                    padding: "32px 32px 0 32px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <h2
                                    style={{
                                        color: MAIN_COLOR,
                                        fontSize: 26,
                                        fontWeight: 700,
                                        marginBottom: 18,
                                        lineHeight: 1.2,
                                        textAlign: "center",
                                        direction: language === "ar" ? "rtl" : "ltr",
                                    }}
                                >
                                    {article.title}
                                </h2>
                                <div
                                    style={{
                                        color: "#222",
                                        fontSize: 17,
                                        lineHeight: 1.7,
                                        direction: language === "ar" ? "rtl" : "ltr",
                                        textAlign: language === "ar" ? "right" : "left",
                                        margin: "0 auto",
                                        maxWidth: 600,
                                    }}
                                >
                                    {article.body}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GalerieMedia;