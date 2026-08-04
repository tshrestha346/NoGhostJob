const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");


function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function formatDateRange(
  start,
  end,
  current = false
) {
  if (!start && !end && !current) {
    return "";
  }

  return `${escapeHtml(start || "")} – ${
    current
      ? "Present"
      : escapeHtml(end || "")
  }`;
}


function formatDescription(value = "") {
  return escapeHtml(value).replace(
    /\n/g,
    "<br />"
  );
}


function findChromeExecutable() {
  const possiblePaths = [
    process.env.CHROME_PATH,

    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",

    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",

    process.env.LOCALAPPDATA
      ? path.join(
          process.env.LOCALAPPDATA,
          "Google",
          "Chrome",
          "Application",
          "chrome.exe"
        )
      : null,
  ].filter(Boolean);

  for (const chromePath of possiblePaths) {
    if (fs.existsSync(chromePath)) {
      // console.log(
      //   "Using Chrome executable:",
      //   chromePath
      // );

      return chromePath;
    }
  }

  return null;
}


function buildCvHtml(
  cv = {},
  user = {}
) {

  const cvData =
    cv?.data &&
    typeof cv.data === "object"
      ? cv.data
      : cv;

  const personal =
    cvData?.personal || {};

  const summary =
    cvData?.summary || "";

  const skills =
    Array.isArray(cvData?.skills)
      ? cvData.skills
      : [];

  const experience =
    Array.isArray(cvData?.experience)
      ? cvData.experience
      : [];

  const education =
    Array.isArray(cvData?.education)
      ? cvData.education
      : [];

  const languages =
    Array.isArray(cvData?.languages)
      ? cvData.languages
      : [];

  const projects =
    Array.isArray(cvData?.projects)
      ? cvData.projects
      : [];

  const certifications =
    Array.isArray(
      cvData?.certifications
    )
      ? cvData.certifications
      : [];

  const fullName =
    personal.fullName ||
    user.fullName ||
    user.name ||
    "Applicant";

  const jobTitle =
    personal.jobTitle ||
    user.role ||
    "";

  const email =
    personal.email ||
    user.email ||
    "";

  const phone =
    personal.phone ||
    user.phoneNo ||
    user.phone ||
    "";

  const location =
    personal.location ||
    [
      user.address,
      user.postalCode,
      user.country,
    ]
      .filter(Boolean)
      .join(", ");

  const validExperience =
    experience.filter(
      (item) =>
        item &&
        (item.role ||
          item.company ||
          item.description)
    );

  const validEducation =
    education.filter(
      (item) =>
        item &&
        (item.degree ||
          item.school ||
          item.description)
    );

  const validLanguages =
    languages.filter(
      (item) => item?.name
    );

  const validProjects =
    projects.filter(
      (item) => item?.name
    );

  const validCertifications =
    certifications.filter(
      (item) => item?.name
    );

  const skillsHtml =
    skills.length > 0
      ? skills
          .map(
            (skill) => `
              <span class="skill">
                ${escapeHtml(skill)}
              </span>
            `
          )
          .join("")
      : `<p class="empty">No skills added.</p>`;

  const experienceHtml =
    validExperience.length > 0
      ? validExperience
          .map(
            (item) => `
              <div class="entry">
                <div class="entry-header">
                  <div>
                    <h3>
                      ${escapeHtml(
                        item.role ||
                          "Position"
                      )}
                    </h3>

                    <p class="organisation">
                      ${escapeHtml(
                        item.company || ""
                      )}
                    </p>
                  </div>

                  <p class="date">
                    ${formatDateRange(
                      item.start,
                      item.end,
                      item.current
                    )}
                  </p>
                </div>

                ${
                  item.location
                    ? `
                      <p class="location">
                        ${escapeHtml(
                          item.location
                        )}
                      </p>
                    `
                    : ""
                }

                ${
                  item.description
                    ? `
                      <p class="description">
                        ${formatDescription(
                          item.description
                        )}
                      </p>
                    `
                    : ""
                }
              </div>
            `
          )
          .join("")
      : `<p class="empty">No experience added.</p>`;

  const educationHtml =
    validEducation.length > 0
      ? validEducation
          .map(
            (item) => `
              <div class="entry">
                <div class="entry-header">
                  <div>
                    <h3>
                      ${escapeHtml(
                        item.degree ||
                          "Qualification"
                      )}
                    </h3>

                    <p class="organisation">
                      ${escapeHtml(
                        item.school || ""
                      )}
                    </p>
                  </div>

                  <p class="date">
                    ${formatDateRange(
                      item.start,
                      item.end,
                      false
                    )}
                  </p>
                </div>

                ${
                  item.location
                    ? `
                      <p class="location">
                        ${escapeHtml(
                          item.location
                        )}
                      </p>
                    `
                    : ""
                }

                ${
                  item.description
                    ? `
                      <p class="description">
                        ${formatDescription(
                          item.description
                        )}
                      </p>
                    `
                    : ""
                }
              </div>
            `
          )
          .join("")
      : `<p class="empty">No education added.</p>`;

  const languagesHtml =
    validLanguages.length > 0
      ? validLanguages
          .map(
            (item) => `
              <div class="language-row">
                <span>
                  ${escapeHtml(
                    item.name
                  )}
                </span>

                <span class="muted">
                  ${escapeHtml(
                    item.level || ""
                  )}
                </span>
              </div>
            `
          )
          .join("")
      : `<p class="empty">No languages added.</p>`;

  const projectsHtml =
    validProjects.length > 0
      ? validProjects
          .map(
            (item) => `
              <div class="entry">
                <h3>
                  ${escapeHtml(
                    item.name
                  )}
                </h3>

                ${
                  item.link
                    ? `
                      <p class="project-link">
                        ${escapeHtml(
                          item.link
                        )}
                      </p>
                    `
                    : ""
                }

                ${
                  item.description
                    ? `
                      <p class="description">
                        ${formatDescription(
                          item.description
                        )}
                      </p>
                    `
                    : ""
                }
              </div>
            `
          )
          .join("")
      : "";

  const certificationsHtml =
    validCertifications.length > 0
      ? validCertifications
          .map(
            (item) => `
              <div class="certification">
                <strong>
                  ${escapeHtml(
                    item.name
                  )}
                </strong>

                <p>
                  ${[
                    item.issuer,
                    item.year,
                  ]
                    .filter(Boolean)
                    .map(escapeHtml)
                    .join(" · ")}
                </p>
              </div>
            `
          )
          .join("")
      : "";

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>
          ${escapeHtml(fullName)} CV
        </title>

        <style>
          @page {
            size: A4;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
            color: #172033;
          }

          body {
            width: 210mm;
            min-height: 297mm;
          }

          .cv {
            width: 100%;
            min-height: 297mm;
            background: #ffffff;
          }

          .header {
            padding: 28px 38px;
            color: #ffffff;
            background:
              linear-gradient(
                120deg,
                #07192e,
                #1565c0
              );
          }

          .header h1 {
            margin: 0;
            font-size: 32px;
            line-height: 1.2;
          }

          .job-title {
            margin: 8px 0 0;
            font-size: 18px;
            color: #dbeafe;
          }

          .contact {
            display: flex;
            flex-wrap: wrap;
            gap: 8px 18px;
            margin-top: 18px;
            font-size: 11px;
            color: #dbeafe;
          }

          .content {
            display: grid;
            grid-template-columns:
              33% 67%;
          }

          .sidebar {
            padding: 28px 24px;
            background: #f3f7fd;
          }

          .main {
            padding: 28px 32px;
          }

          .section {
            margin-bottom: 26px;
            page-break-inside: avoid;
          }

          .section-title {
            margin: 0 0 12px;
            padding-bottom: 6px;
            border-bottom:
              2px solid #1565c0;
            color: #0b438f;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .profile {
            margin: 0;
            font-size: 12px;
            line-height: 1.7;
            color: #475569;
          }

          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
          }

          .skill {
            display: inline-block;
            padding: 6px 9px;
            border-radius: 12px;
            background: #dbeafe;
            color: #174ea6;
            font-size: 10px;
            font-weight: 600;
          }

          .entry {
            margin-bottom: 18px;
            page-break-inside: avoid;
          }

          .entry:last-child {
            margin-bottom: 0;
          }

          .entry-header {
            display: flex;
            align-items: flex-start;
            justify-content:
              space-between;
            gap: 16px;
          }

          .entry h3 {
            margin: 0;
            font-size: 13px;
            color: #172033;
          }

          .organisation {
            margin: 3px 0 0;
            color: #64748b;
            font-size: 11px;
          }

          .date {
            margin: 0;
            color: #64748b;
            font-size: 10px;
            white-space: nowrap;
          }

          .location {
            margin: 4px 0 0;
            color: #94a3b8;
            font-size: 10px;
          }

          .description {
            margin: 7px 0 0;
            color: #475569;
            font-size: 11px;
            line-height: 1.6;
          }

          .language-row {
            display: flex;
            justify-content:
              space-between;
            gap: 12px;
            margin-bottom: 8px;
            font-size: 11px;
          }

          .certification {
            margin-bottom: 12px;
            font-size: 11px;
          }

          .certification strong {
            display: block;
          }

          .certification p {
            margin: 3px 0 0;
            color: #64748b;
            font-size: 10px;
          }

          .project-link {
            margin: 4px 0;
            color: #1565c0;
            font-size: 10px;
          }

          .muted,
          .empty {
            color: #94a3b8;
          }

          .empty {
            margin: 0;
            font-size: 11px;
          }
        </style>
      </head>

      <body>
        <div class="cv">
          <header class="header">
            <h1>
              ${escapeHtml(fullName)}
            </h1>

            ${
              jobTitle
                ? `
                  <p class="job-title">
                    ${escapeHtml(
                      jobTitle
                    )}
                  </p>
                `
                : ""
            }

            <div class="contact">
              ${
                email
                  ? `
                    <span>
                      ${escapeHtml(email)}
                    </span>
                  `
                  : ""
              }

              ${
                phone
                  ? `
                    <span>
                      ${escapeHtml(phone)}
                    </span>
                  `
                  : ""
              }

              ${
                location
                  ? `
                    <span>
                      ${escapeHtml(location)}
                    </span>
                  `
                  : ""
              }

              ${
                personal.linkedin
                  ? `
                    <span>
                      ${escapeHtml(
                        personal.linkedin
                      )}
                    </span>
                  `
                  : ""
              }

              ${
                personal.website
                  ? `
                    <span>
                      ${escapeHtml(
                        personal.website
                      )}
                    </span>
                  `
                  : ""
              }
            </div>
          </header>

          <div class="content">
            <aside class="sidebar">
              <section class="section">
                <h2 class="section-title">
                  Skills
                </h2>

                <div class="skills">
                  ${skillsHtml}
                </div>
              </section>

              <section class="section">
                <h2 class="section-title">
                  Languages
                </h2>

                ${languagesHtml}
              </section>

              ${
                certificationsHtml
                  ? `
                    <section class="section">
                      <h2 class="section-title">
                        Certifications
                      </h2>

                      ${certificationsHtml}
                    </section>
                  `
                  : ""
              }
            </aside>

            <main class="main">
              <section class="section">
                <h2 class="section-title">
                  Profile
                </h2>

                <p class="profile">
                  ${
                    summary
                      ? formatDescription(
                          summary
                        )
                      : "Professional summary not provided."
                  }
                </p>
              </section>

              <section class="section">
                <h2 class="section-title">
                  Experience
                </h2>

                ${experienceHtml}
              </section>

              <section class="section">
                <h2 class="section-title">
                  Education
                </h2>

                ${educationHtml}
              </section>

              ${
                projectsHtml
                  ? `
                    <section class="section">
                      <h2 class="section-title">
                        Projects
                      </h2>

                      ${projectsHtml}
                    </section>
                  `
                  : ""
              }
            </main>
          </div>
        </div>
      </body>
    </html>
  `;
}


async function generateCvPdf({
  cv,
  user,
}) {
  const outputDirectory =
    path.join(
      __dirname,
      "..",
      "uploads",
      "cvs"
    );

  await fs.promises.mkdir(
    outputDirectory,
    {
      recursive: true,
    }
  );

  const filename =
    `cv-${user._id}-${Date.now()}.pdf`;

  const absolutePath =
    path.join(
      outputDirectory,
      filename
    );

  const relativeUrl =
    `/uploads/cvs/${filename}`;


  const html =
    buildCvHtml(cv, user);

  const chromeExecutable =
    findChromeExecutable();

  const launchOptions = {
    headless: true,

    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  };

  if (chromeExecutable) {
    launchOptions.executablePath =
      chromeExecutable;
  }

  let browser = null;

  try {
    browser =
      await puppeteer.launch(
        launchOptions
      );

    const page =
      await browser.newPage();

    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1,
    });

    await page.setContent(
      html,
      {
        waitUntil:
          "networkidle0",
        timeout: 30000,
      }
    );

    await page.emulateMediaType(
      "screen"
    );

    await page.pdf({
      path: absolutePath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,

      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    if (
      !fs.existsSync(
        absolutePath
      )
    ) {
      throw new Error(
        "The PDF file was not created."
      );
    }

    return {
      filename,
      absolutePath,
      relativeUrl,
    };
  } catch (error) {
    console.error(
      "CV PDF generation error:",
      error
    );


    if (
      fs.existsSync(
        absolutePath
      )
    ) {
      try {
        await fs.promises.unlink(
          absolutePath
        );
      } catch (
        deleteError
      ) {
        console.error(
          "Unable to remove incomplete PDF:",
          deleteError
        );
      }
    }

    throw new Error(
      `Unable to generate CV PDF: ${error.message}`
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  generateCvPdf,
  buildCvHtml,
};