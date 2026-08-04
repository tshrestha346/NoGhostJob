import React from "react";

function safeArray(value) {
  return Array.isArray(value)
    ? value
    : [];
}

function safeObject(value) {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? value
    : {};
}

function formatRange(
  start,
  end,
  current
) {
  if (
    !start &&
    !end &&
    !current
  ) {
    return "";
  }

  return `${start || ""} – ${
    current
      ? "Present"
      : end || ""
  }`;
}

function normalizeSkill(skill) {
  if (
    typeof skill === "string"
  ) {
    return skill;
  }

  return (
    skill?.name ||
    skill?.skill ||
    skill?.title ||
    ""
  );
}

function hasCvContent(data) {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return false;
  }

  const personal =
    safeObject(data.personal);

  const hasPersonal =
    Object.values(
      personal
    ).some(
      (value) =>
        typeof value ===
          "string" &&
        value.trim()
    );

  return Boolean(
    hasPersonal ||
      data.summary ||
      safeArray(data.skills)
        .length ||
      safeArray(data.experience)
        .some(
          (item) =>
            item?.role ||
            item?.company
        ) ||
      safeArray(data.education)
        .some(
          (item) =>
            item?.degree ||
            item?.school
        ) ||
      safeArray(data.projects)
        .some(
          (item) =>
            item?.name
        )
  );
}

function normalizeTemplate(
  template
) {
  const normalized =
    String(
      template || "modern"
    )
      .trim()
      .toLowerCase();

  const templates = [
    "modern",
    "europass",
    "minimal",
    "executive",
  ];

  return templates.includes(
    normalized
  )
    ? normalized
    : "modern";
}


function BlueSection({
  title,
  children,
}) {
  return (
    <section className="mb-7 break-inside-avoid">
      <h2 className="mb-3 border-b-2 border-blue-600 pb-1 text-sm font-bold uppercase tracking-wider text-blue-700">
        {title}
      </h2>

      {children}
    </section>
  );
}

function MinimalSection({
  title,
  children,
}) {
  return (
    <section className="mb-6 break-inside-avoid">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
        {title}
      </h2>

      {children}
    </section>
  );
}

function ExecutiveSection({
  title,
  children,
}) {
  return (
    <section className="mb-8 break-inside-avoid">
      <h2 className="mb-3 border-b-2 border-[#0B1F3A] pb-1 text-sm font-bold uppercase tracking-wider text-[#0B1F3A]">
        {title}
      </h2>

      {children}
    </section>
  );
}


function ModernTemplate({
  data,
}) {
  const personal =
    safeObject(data.personal);

  const skills =
    safeArray(data.skills)
      .map(normalizeSkill)
      .filter(Boolean);

  const experience =
    safeArray(
      data.experience
    ).filter(
      (item) =>
        item?.role ||
        item?.company
    );

  const education =
    safeArray(
      data.education
    ).filter(
      (item) =>
        item?.degree ||
        item?.school
    );

  const languages =
    safeArray(
      data.languages
    ).filter(
      (item) =>
        item?.name
    );

  const projects =
    safeArray(
      data.projects
    ).filter(
      (item) =>
        item?.name
    );

  const certifications =
    safeArray(
      data.certifications
    ).filter(
      (item) =>
        item?.name
    );

  return (
    <div className="min-h-[1122px] w-[794px] bg-white text-[#07192E]">
      <header className="bg-gradient-to-r from-[#07192E] to-blue-700 px-10 py-10 text-white">
        <h1 className="text-4xl font-bold">
          {personal.fullName ||
            "Applicant"}
        </h1>

        <p className="mt-2 text-xl text-blue-100">
          {personal.jobTitle ||
            "Professional"}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-blue-100">
          {personal.email && (
            <span>
              {personal.email}
            </span>
          )}

          {personal.phone && (
            <span>
              {personal.phone}
            </span>
          )}

          {personal.location && (
            <span>
              {
                personal.location
              }
            </span>
          )}

          {personal.linkedin && (
            <span className="break-all">
              {
                personal.linkedin
              }
            </span>
          )}

          {personal.website && (
            <span className="break-all">
              {
                personal.website
              }
            </span>
          )}
        </div>
      </header>

      <div className="grid grid-cols-[260px_1fr] gap-8 px-10 py-8">
        <aside>
          <BlueSection title="Skills">
            {skills.length >
            0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map(
                  (
                    skill,
                    index
                  ) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No skills
                provided
              </p>
            )}
          </BlueSection>

          {languages.length >
            0 && (
            <BlueSection title="Languages">
              <div className="space-y-2 text-sm text-slate-600">
                {languages.map(
                  (
                    item,
                    index
                  ) => (
                    <p
                      key={
                        item?.id ||
                        index
                      }
                    >
                      {item.name}

                      {item.level && (
                        <span className="text-slate-400">
                          {" "}
                          —{" "}
                          {
                            item.level
                          }
                        </span>
                      )}
                    </p>
                  )
                )}
              </div>
            </BlueSection>
          )}

          {certifications.length >
            0 && (
            <BlueSection title="Certifications">
              <div className="space-y-3">
                {certifications.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item?.id ||
                        index
                      }
                    >
                      <p className="text-sm font-semibold text-[#07192E]">
                        {item.name}
                      </p>

                      <p className="text-xs text-slate-400">
                        {[
                          item.issuer,
                          item.year,
                        ]
                          .filter(
                            Boolean
                          )
                          .join(
                            " · "
                          )}
                      </p>
                    </div>
                  )
                )}
              </div>
            </BlueSection>
          )}
        </aside>

        <main>
          {data.summary && (
            <BlueSection title="Profile">
              <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                {data.summary}
              </p>
            </BlueSection>
          )}

          {experience.length >
            0 && (
            <BlueSection title="Experience">
              <div className="space-y-5">
                {experience.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item?.id ||
                        index
                      }
                      className="break-inside-avoid"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-bold text-[#07192E]">
                          {item.role ||
                            "Role"}

                          {item.company && (
                            <span className="font-normal text-slate-500">
                              {" "}
                              ·{" "}
                              {
                                item.company
                              }
                            </span>
                          )}
                        </p>

                        <p className="shrink-0 text-xs font-medium text-slate-400">
                          {formatRange(
                            item.start,
                            item.end,
                            item.current
                          )}
                        </p>
                      </div>

                      {item.location && (
                        <p className="text-xs text-slate-400">
                          {
                            item.location
                          }
                        </p>
                      )}

                      {item.description && (
                        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                          {
                            item.description
                          }
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </BlueSection>
          )}

          {education.length >
            0 && (
            <BlueSection title="Education">
              <div className="space-y-4">
                {education.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item?.id ||
                        index
                      }
                      className="break-inside-avoid"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-bold text-[#07192E]">
                          {item.degree ||
                            "Degree"}

                          {item.school && (
                            <span className="font-normal text-slate-500">
                              {" "}
                              ·{" "}
                              {
                                item.school
                              }
                            </span>
                          )}
                        </p>

                        <p className="shrink-0 text-xs font-medium text-slate-400">
                          {formatRange(
                            item.start,
                            item.end,
                            false
                          )}
                        </p>
                      </div>

                      {item.location && (
                        <p className="text-xs text-slate-400">
                          {
                            item.location
                          }
                        </p>
                      )}

                      {item.description && (
                        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                          {
                            item.description
                          }
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </BlueSection>
          )}

          {projects.length >
            0 && (
            <BlueSection title="Projects">
              <div className="space-y-4">
                {projects.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item?.id ||
                        index
                      }
                      className="break-inside-avoid"
                    >
                      <p className="font-bold text-[#07192E]">
                        {item.name}

                        {item.link && (
                          <span className="break-all font-normal text-blue-600">
                            {" "}
                            (
                            {
                              item.link
                            }
                            )
                          </span>
                        )}
                      </p>

                      {item.description && (
                        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                          {
                            item.description
                          }
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </BlueSection>
          )}
        </main>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Europass Style
|--------------------------------------------------------------------------
*/

function EuropassTemplate({
  data,
}) {
  const personal =
    safeObject(data.personal);

  const skills =
    safeArray(data.skills)
      .map(normalizeSkill)
      .filter(Boolean);

  const experience =
    safeArray(
      data.experience
    ).filter(
      (item) =>
        item?.role ||
        item?.company
    );

  const education =
    safeArray(
      data.education
    ).filter(
      (item) =>
        item?.degree ||
        item?.school
    );

  const languages =
    safeArray(
      data.languages
    ).filter(
      (item) =>
        item?.name
    );

  const projects =
    safeArray(
      data.projects
    ).filter(
      (item) =>
        item?.name
    );

  const certifications =
    safeArray(
      data.certifications
    ).filter(
      (item) =>
        item?.name
    );

  const SidebarSection = ({
    title,
    children,
  }) => (
    <section className="mb-8 break-inside-avoid text-sm">
      <h3 className="mb-3 border-b border-blue-300 pb-1 font-bold uppercase text-blue-700">
        {title}
      </h3>

      <div className="space-y-1 text-slate-700">
        {children}
      </div>
    </section>
  );

  const MainSection = ({
    title,
    children,
  }) => (
    <section className="mb-8 break-inside-avoid">
      <h2 className="mb-3 border-b-2 border-blue-700 pb-1 text-lg font-bold text-blue-700">
        {title}
      </h2>

      {children}
    </section>
  );

  return (
    <div className="min-h-[1122px] w-[794px] bg-white text-[#07192E]">
      <header className="border-b-4 border-blue-700 px-10 py-8">
        <h1 className="text-3xl font-bold uppercase tracking-wide">
          {personal.fullName ||
            "Applicant"}
        </h1>

        <p className="mt-2 text-lg font-semibold text-blue-700">
          {personal.jobTitle ||
            "Curriculum Vitae"}
        </p>
      </header>

      <div className="grid grid-cols-[230px_1fr]">
        <aside className="min-h-[1000px] bg-blue-50 px-6 py-8">
          <SidebarSection title="Personal info">
            {personal.email && (
              <p className="break-all">
                {personal.email}
              </p>
            )}

            {personal.phone && (
              <p>
                {personal.phone}
              </p>
            )}

            {personal.location && (
              <p>
                {
                  personal.location
                }
              </p>
            )}

            {personal.linkedin && (
              <p className="break-all">
                {
                  personal.linkedin
                }
              </p>
            )}

            {personal.website && (
              <p className="break-all">
                {
                  personal.website
                }
              </p>
            )}
          </SidebarSection>

          {skills.length >
            0 && (
            <SidebarSection title="Skills">
              <ul className="list-disc space-y-1 pl-4">
                {skills.map(
                  (
                    skill,
                    index
                  ) => (
                    <li
                      key={`${skill}-${index}`}
                    >
                      {skill}
                    </li>
                  )
                )}
              </ul>
            </SidebarSection>
          )}

          {languages.length >
            0 && (
            <SidebarSection title="Languages">
              {languages.map(
                (
                  item,
                  index
                ) => (
                  <p
                    key={
                      item?.id ||
                      index
                    }
                  >
                    {item.name}

                    {item.level && (
                      <span className="text-slate-400">
                        {" "}
                        —{" "}
                        {
                          item.level
                        }
                      </span>
                    )}
                  </p>
                )
              )}
            </SidebarSection>
          )}

          {certifications.length >
            0 && (
            <SidebarSection title="Certifications">
              <div className="space-y-3">
                {certifications.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item?.id ||
                        index
                      }
                    >
                      <p className="font-semibold">
                        {item.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {[
                          item.issuer,
                          item.year,
                        ]
                          .filter(
                            Boolean
                          )
                          .join(
                            " · "
                          )}
                      </p>
                    </div>
                  )
                )}
              </div>
            </SidebarSection>
          )}
        </aside>

        <main className="px-8 py-8">
          {data.summary && (
            <MainSection title="Profile">
              <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                {data.summary}
              </p>
            </MainSection>
          )}

          {experience.length >
            0 && (
            <MainSection title="Work Experience">
              <div className="space-y-5">
                {experience.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item?.id ||
                        index
                      }
                    >
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <p className="font-bold">
                          {item.role ||
                            "Role"}

                          {item.company && (
                            <span className="font-normal text-slate-500">
                              {" "}
                              ·{" "}
                              {
                                item.company
                              }
                            </span>
                          )}
                        </p>

                        <p className="shrink-0 text-xs text-slate-400">
                          {formatRange(
                            item.start,
                            item.end,
                            item.current
                          )}
                        </p>
                      </div>

                      {item.location && (
                        <p className="mt-1 text-xs text-slate-400">
                          {
                            item.location
                          }
                        </p>
                      )}

                      {item.description && (
                        <p className="mt-1 whitespace-pre-line text-sm leading-7 text-slate-700">
                          {
                            item.description
                          }
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </MainSection>
          )}

          {education.length >
            0 && (
            <MainSection title="Education and Training">
              <div className="space-y-5">
                {education.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item?.id ||
                        index
                      }
                    >
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <p className="font-bold">
                          {item.degree ||
                            "Degree"}

                          {item.school && (
                            <span className="font-normal text-slate-500">
                              {" "}
                              ·{" "}
                              {
                                item.school
                              }
                            </span>
                          )}
                        </p>

                        <p className="shrink-0 text-xs text-slate-400">
                          {formatRange(
                            item.start,
                            item.end,
                            false
                          )}
                        </p>
                      </div>

                      {item.location && (
                        <p className="mt-1 text-xs text-slate-400">
                          {
                            item.location
                          }
                        </p>
                      )}

                      {item.description && (
                        <p className="mt-1 whitespace-pre-line text-sm leading-7 text-slate-700">
                          {
                            item.description
                          }
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </MainSection>
          )}

          {projects.length >
            0 && (
            <MainSection title="Projects">
              <div className="space-y-5">
                {projects.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item?.id ||
                        index
                      }
                    >
                      <p className="font-bold">
                        {item.name}
                      </p>

                      {item.link && (
                        <p className="break-all text-sm text-blue-700">
                          {item.link}
                        </p>
                      )}

                      {item.description && (
                        <p className="mt-1 whitespace-pre-line text-sm leading-7 text-slate-700">
                          {
                            item.description
                          }
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </MainSection>
          )}
        </main>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Minimal ATS
|--------------------------------------------------------------------------
*/

function MinimalTemplate({
  data,
}) {
  const personal =
    safeObject(data.personal);

  const skills =
    safeArray(data.skills)
      .map(normalizeSkill)
      .filter(Boolean);

  const experience =
    safeArray(
      data.experience
    ).filter(
      (item) =>
        item?.role ||
        item?.company
    );

  const education =
    safeArray(
      data.education
    ).filter(
      (item) =>
        item?.degree ||
        item?.school
    );

  const languages =
    safeArray(
      data.languages
    ).filter(
      (item) =>
        item?.name
    );

  const projects =
    safeArray(
      data.projects
    ).filter(
      (item) =>
        item?.name
    );

  const certifications =
    safeArray(
      data.certifications
    ).filter(
      (item) =>
        item?.name
    );

  const contactLine = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-[1122px] w-[794px] bg-white px-14 py-12 text-[#1B2433]">
      <header className="mb-8 border-b border-slate-300 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {personal.fullName ||
            "Applicant"}
        </h1>

        <p className="mt-1 text-base text-slate-600">
          {personal.jobTitle ||
            "Professional"}
        </p>

        {contactLine && (
          <p className="mt-3 break-words text-xs leading-5 text-slate-500">
            {contactLine}
          </p>
        )}
      </header>

      {data.summary && (
        <MinimalSection title="Summary">
          <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
            {data.summary}
          </p>
        </MinimalSection>
      )}

      {experience.length >
        0 && (
        <MinimalSection title="Experience">
          <div className="space-y-5">
            {experience.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    item?.id ||
                    index
                  }
                >
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <p className="font-semibold">
                      {item.role ||
                        "Role"}

                      {item.company &&
                        `, ${item.company}`}
                    </p>

                    <p className="shrink-0 text-xs text-slate-500">
                      {formatRange(
                        item.start,
                        item.end,
                        item.current
                      )}
                    </p>
                  </div>

                  {item.location && (
                    <p className="text-xs text-slate-400">
                      {
                        item.location
                      }
                    </p>
                  )}

                  {item.description && (
                    <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">
                      {
                        item.description
                      }
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </MinimalSection>
      )}

      {education.length >
        0 && (
        <MinimalSection title="Education">
          <div className="space-y-4">
            {education.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    item?.id ||
                    index
                  }
                >
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <p className="font-semibold">
                      {item.degree ||
                        "Degree"}

                      {item.school &&
                        `, ${item.school}`}
                    </p>

                    <p className="shrink-0 text-xs text-slate-500">
                      {formatRange(
                        item.start,
                        item.end,
                        false
                      )}
                    </p>
                  </div>

                  {item.location && (
                    <p className="text-xs text-slate-400">
                      {
                        item.location
                      }
                    </p>
                  )}

                  {item.description && (
                    <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">
                      {
                        item.description
                      }
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </MinimalSection>
      )}

      {skills.length > 0 && (
        <MinimalSection title="Skills">
          <p className="text-sm leading-7 text-slate-700">
            {skills.join(" · ")}
          </p>
        </MinimalSection>
      )}

      {languages.length >
        0 && (
        <MinimalSection title="Languages">
          <p className="text-sm leading-7 text-slate-700">
            {languages
              .map(
                (item) =>
                  `${item.name}${
                    item.level
                      ? ` (${item.level})`
                      : ""
                  }`
              )
              .join(" · ")}
          </p>
        </MinimalSection>
      )}

      {projects.length >
        0 && (
        <MinimalSection title="Projects">
          <div className="space-y-4">
            {projects.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    item?.id ||
                    index
                  }
                >
                  <p className="text-sm font-semibold">
                    {item.name}

                    {item.link && (
                      <span className="break-all font-normal text-slate-500">
                        {" "}
                        ({item.link})
                      </span>
                    )}
                  </p>

                  {item.description && (
                    <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">
                      {
                        item.description
                      }
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </MinimalSection>
      )}

      {certifications.length >
        0 && (
        <MinimalSection title="Certifications">
          <p className="text-sm leading-7 text-slate-700">
            {certifications
              .map((item) =>
                [
                  item.name,
                  item.issuer,
                  item.year,
                ]
                  .filter(Boolean)
                  .join(", ")
              )
              .join(" · ")}
          </p>
        </MinimalSection>
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Executive
|--------------------------------------------------------------------------
*/

function ExecutiveTemplate({
  data,
}) {
  const personal =
    safeObject(data.personal);

  const skills =
    safeArray(data.skills)
      .map(normalizeSkill)
      .filter(Boolean);

  const experience =
    safeArray(
      data.experience
    ).filter(
      (item) =>
        item?.role ||
        item?.company
    );

  const education =
    safeArray(
      data.education
    ).filter(
      (item) =>
        item?.degree ||
        item?.school
    );

  const languages =
    safeArray(
      data.languages
    ).filter(
      (item) =>
        item?.name
    );

  const projects =
    safeArray(
      data.projects
    ).filter(
      (item) =>
        item?.name
    );

  const certifications =
    safeArray(
      data.certifications
    ).filter(
      (item) =>
        item?.name
    );

  const SidebarSection = ({
    title,
    children,
  }) => (
    <section className="mt-8 break-inside-avoid">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-400">
        {title}
      </h3>

      {children}
    </section>
  );

  return (
    <div className="grid min-h-[1122px] w-[794px] grid-cols-[270px_1fr] bg-white text-[#1B2433]">
      <aside className="bg-[#0B1F3A] px-7 py-10 text-white">
        <h1 className="text-2xl font-bold leading-tight">
          {personal.fullName ||
            "Applicant"}
        </h1>

        <p className="mt-1 text-sm font-medium uppercase tracking-wide text-amber-400">
          {personal.jobTitle ||
            "Professional"}
        </p>

        <div className="mt-8 space-y-2 break-all text-xs text-slate-300">
          {personal.email && (
            <p>
              {personal.email}
            </p>
          )}

          {personal.phone && (
            <p>
              {personal.phone}
            </p>
          )}

          {personal.location && (
            <p>
              {
                personal.location
              }
            </p>
          )}

          {personal.linkedin && (
            <p>
              {
                personal.linkedin
              }
            </p>
          )}

          {personal.website && (
            <p>
              {
                personal.website
              }
            </p>
          )}
        </div>

        {skills.length > 0 && (
          <SidebarSection title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {skills.map(
                (
                  skill,
                  index
                ) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded bg-white/10 px-2 py-1 text-[11px] font-medium"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </SidebarSection>
        )}

        {education.length >
          0 && (
          <SidebarSection title="Education">
            <div className="space-y-4 text-xs text-slate-300">
              {education.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      item?.id ||
                      index
                    }
                  >
                    <p className="font-semibold text-white">
                      {item.degree ||
                        "Degree"}
                    </p>

                    {item.school && (
                      <p>
                        {item.school}
                      </p>
                    )}

                    {item.location && (
                      <p>
                        {
                          item.location
                        }
                      </p>
                    )}

                    <p className="text-slate-400">
                      {formatRange(
                        item.start,
                        item.end,
                        false
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          </SidebarSection>
        )}

        {languages.length >
          0 && (
          <SidebarSection title="Languages">
            <div className="space-y-2 text-xs text-slate-300">
              {languages.map(
                (
                  item,
                  index
                ) => (
                  <p
                    key={
                      item?.id ||
                      index
                    }
                  >
                    {item.name}

                    {item.level && (
                      <span className="text-slate-500">
                        {" "}
                        —{" "}
                        {
                          item.level
                        }
                      </span>
                    )}
                  </p>
                )
              )}
            </div>
          </SidebarSection>
        )}

        {certifications.length >
          0 && (
          <SidebarSection title="Certifications">
            <div className="space-y-3 text-xs text-slate-300">
              {certifications.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      item?.id ||
                      index
                    }
                  >
                    <p className="font-semibold text-white">
                      {item.name}
                    </p>

                    <p className="text-slate-400">
                      {[
                        item.issuer,
                        item.year,
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          " · "
                        )}
                    </p>
                  </div>
                )
              )}
            </div>
          </SidebarSection>
        )}
      </aside>

      <main className="px-9 py-10">
        {data.summary && (
          <ExecutiveSection title="Executive Profile">
            <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
              {data.summary}
            </p>
          </ExecutiveSection>
        )}

        {experience.length >
          0 && (
          <ExecutiveSection title="Experience">
            <div className="space-y-6 border-l-2 border-amber-400/40 pl-5">
              {experience.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      item?.id ||
                      index
                    }
                    className="relative break-inside-avoid"
                  >
                    <span className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full bg-amber-500" />

                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-bold text-[#0B1F3A]">
                        {item.role ||
                          "Role"}

                        {item.company && (
                          <span className="font-normal text-slate-500">
                            {" "}
                            ·{" "}
                            {
                              item.company
                            }
                          </span>
                        )}
                      </p>

                      <p className="shrink-0 text-xs font-medium text-slate-400">
                        {formatRange(
                          item.start,
                          item.end,
                          item.current
                        )}
                      </p>
                    </div>

                    {item.location && (
                      <p className="text-xs text-slate-400">
                        {
                          item.location
                        }
                      </p>
                    )}

                    {item.description && (
                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                        {
                          item.description
                        }
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </ExecutiveSection>
        )}

        {projects.length >
          0 && (
          <ExecutiveSection title="Key Projects">
            <div className="space-y-4">
              {projects.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      item?.id ||
                      index
                    }
                    className="break-inside-avoid"
                  >
                    <p className="font-bold text-[#0B1F3A]">
                      {item.name}

                      {item.link && (
                        <span className="break-all font-normal text-amber-600">
                          {" "}
                          (
                          {item.link})
                        </span>
                      )}
                    </p>

                    {item.description && (
                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">
                        {
                          item.description
                        }
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </ExecutiveSection>
        )}
      </main>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Template renderer
|--------------------------------------------------------------------------
*/

function CvTemplateRenderer({
  template,
  data,
}) {
  switch (
    normalizeTemplate(template)
  ) {
    case "europass":
      return (
        <EuropassTemplate
          data={data}
        />
      );

    case "minimal":
      return (
        <MinimalTemplate
          data={data}
        />
      );

    case "executive":
      return (
        <ExecutiveTemplate
          data={data}
        />
      );

    case "modern":
    default:
      return (
        <ModernTemplate
          data={data}
        />
      );
  }
}

/*
|--------------------------------------------------------------------------
| Main applicant CV viewer
|--------------------------------------------------------------------------
*/

export default function ApplicantCV({
  cv,
  applicant,
  onClose,
}) {
  /*
  |--------------------------------------------------------------------------
  | Expected backend structure:
  |
  | cv: {
  |   template: "modern" | "europass" | "minimal" | "executive",
  |   data: { ... }
  | }
  |--------------------------------------------------------------------------
  */

  const cvData =
    cv?.data &&
    typeof cv.data === "object"
      ? cv.data
      : safeObject(cv);

  const template =
    normalizeTemplate(
      cv?.template ||
        cv?.templateName ||
        "modern"
    );

  /*
  |--------------------------------------------------------------------------
  | Applicant fallback
  |--------------------------------------------------------------------------
  | This only fills missing personal values. It does not replace saved CV data.
  |--------------------------------------------------------------------------
  */

  const savedPersonal =
    safeObject(
      cvData.personal
    );

  const data = {
    ...cvData,

    personal: {
      ...savedPersonal,

      fullName:
        savedPersonal.fullName ||
        savedPersonal.name ||
        applicant?.fullName ||
        applicant?.name ||
        "Applicant",

      jobTitle:
        savedPersonal.jobTitle ||
        savedPersonal.title ||
        applicant?.role ||
        "",

      email:
        savedPersonal.email ||
        applicant?.email ||
        "",

      phone:
        savedPersonal.phone ||
        savedPersonal.phoneNo ||
        applicant?.phoneNo ||
        applicant?.phone ||
        "",

      location:
        savedPersonal.location ||
        savedPersonal.address ||
        applicant?.address ||
        applicant?.location ||
        "",
    },

    summary:
      typeof cvData.summary ===
      "string"
        ? cvData.summary
        : "",

    skills:
      safeArray(
        cvData.skills
      ),

    experience:
      safeArray(
        cvData.experience
      ),

    education:
      safeArray(
        cvData.education
      ),

    languages:
      safeArray(
        cvData.languages
      ),

    projects:
      safeArray(
        cvData.projects
      ),

    certifications:
      safeArray(
        cvData.certifications
      ),
  };

  const handlePrint = () => {
    window.print();
  };

  if (!hasCvContent(data)) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/75 p-5 backdrop-blur-sm">
        <div className="relative w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-2xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-3 rounded-lg p-2 text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            ✕
          </button>

          <div className="text-5xl">
            📄
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            CV not available
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This applicant has
            not saved any CV data
            yet.
          </p>
        </div>
      </div>
    );
  }

  const templateNames = {
    modern:
      "Modern Professional",

    europass:
      "Europass Style",

    minimal:
      "Minimal ATS",

    executive:
      "Executive",
  };

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/75 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <style>
        {`
          @media print {
            body * {
              visibility: hidden !important;
            }

            #applicant-cv-print,
            #applicant-cv-print * {
              visibility: visible !important;
            }

            #applicant-cv-print {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 794px !important;
              margin: 0 !important;
              padding: 0 !important;
              transform: none !important;
              box-shadow: none !important;
            }

            .cv-no-print {
              display: none !important;
            }

            @page {
              size: A4 portrait;
              margin: 0;
            }
          }
        `}
      </style>

      <div
        className="mx-auto w-full max-w-[1100px]"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="cv-no-print mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-xl">
          <div>
            <h2 className="font-bold text-slate-900">
              {
                data.personal
                  .fullName
              }
              &apos;s CV
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Selected template:{" "}
              <span className="font-bold text-blue-700">
                {
                  templateNames[
                    template
                  ]
                }
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={
                handlePrint
              }
              className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800"
            >
              Print / Save as PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>

        <div className="overflow-auto rounded-2xl bg-slate-200 p-3 shadow-2xl sm:p-6">
          <div
            id="applicant-cv-print"
            className="mx-auto w-[794px] origin-top bg-white"
          >
            <CvTemplateRenderer
              template={
                template
              }
              data={data}
            />
          </div>
        </div>
      </div>
    </div>
  );
}