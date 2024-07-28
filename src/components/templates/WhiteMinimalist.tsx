import React from 'react'
import { ResumeData, Theme } from '../../types'
import ReactMarkdown from 'react-markdown'

interface WhiteMinimalistProps {
  data: ResumeData
  theme: Theme
}

const WhiteMinimalist: React.FC<WhiteMinimalistProps> = ({ data, theme }) => {
  return (
    <div id="page" className="shadow-2xl break-words">
      <div
        className="pattern-bg"
        style={{
          fontFamily: theme.font.family,
          backgroundColor: theme.colors.secondary,
          color: theme.colors.primary,
          backgroundImage: 'url(/pattern.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '21cm 29.7cm',
        }}
      >
        <div
          className="grid grid-cols-12"
          style={{ borderColor: theme.colors.primary }}
        >
          <div className="ml-10 col-span-7 mt-30 text-left" style={{ height: '200px' }}>
            <h1
              className="mt-1 text-3xl font-bold"
              style={{ textTransform: 'capitalize' }}
            >
              {data.profile.firstName} {data.profile.lastName}
            </h1>
            <h5 className="uppercase" style={{ color: theme.colors.primary }}>
              {data.profile.heading}
            </h5>
          </div>
          <div className="col-span-4 mt-30 ml-10 text-left" style={{ height: '200px' }}>
            {data.profile.phone && (
              <div className="px-5 my-2 flex">
                <h6 className="text-xs font-bold">Phone</h6>
                <a className="ml-2 text-sm" href={`tel:${data.profile.phone}`}>
                  {data.profile.phone}
                </a>
              </div>
            )}
            {data.profile.email && (
              <div className="px-5 my-2">
                <a className="text-sm" href={`mailto:${data.profile.email}`}>
                  {data.profile.email}
                </a>
              </div>
            )}
            {data.profile.website && (
              <div className="px-5 my-2">
                <a className="text-sm" href={`http://${data.profile.website}`}>
                  {data.profile.website}
                </a>
              </div>
            )}
            {data.profile.address && (
              <div className="px-5 my-2">
                <div className="text-sm">{data.profile.address.line1}</div>
                <div className="text-sm">{data.profile.address.line2}</div>
                <div className="text-sm">{data.profile.address.line3}</div>
              </div>
            )}
          </div>
          <div
            className="col-span-5 ml-2"
            style={{ borderRight: '2px solid' }}
          >
            <h6 className="my-4 mx-5 border-t border-b border-gray-400 uppercase">
              {data.objective.heading}
            </h6>
            {data.objective.body && (
              <div className="m-5 my-3 text-sm">
                <ReactMarkdown>{data.objective.body}</ReactMarkdown>
              </div>
            )}
            {data.skills && data.skills.enable && (
              <div>
                <div className="my-4">
                  <h6 className="my-4 mx-5 border-t border-b border-gray-400 uppercase font-bold">
                    {data.skills.heading}
                  </h6>
                </div>
                <ul className="list-none px-5">
                  {data.skills.items
                    .filter((skill) => skill.enable)
                    .map((skill) => (
                      <li key={skill.id} className="text-sm my-2">
                        {skill.name}
                      </li>
                    ))}
                </ul>
              </div>
            )}
            {data.awards && data.awards.enable && (
              <div>
                <div className="my-4 mx-5 border-t border-b border-gray-400">
                  <h6 className="font-bold uppercase">{data.awards.heading}</h6>
                </div>
                {data.awards.items
                  .filter((x) => x.enable)
                  .map((award) => (
                    <div key={award.id} className="my-3 px-5">
                      <h6 className="font-semibold">{award.title}</h6>
                      <p className="text-xs">{award.description}</p>
                      <div className="mt-2 text-sm">
                        <ReactMarkdown>{award.description}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {data.references && data.references.enable && (
              <div>
                <div className="my-4 mx-5 border-t border-b border-gray-400">
                  <h6 className="font-bold uppercase">{data.references.heading}</h6>
                </div>
                <div className="grid grid-cols-1 gap-6 px-5">
                  {data.references.items
                    .filter((x) => x.enable)
                    .map((reference) => (
                      <div key={reference.id} className="flex flex-col">
                        <h6 className="text-sm font-medium">{reference.name}</h6>
                        {/* <span className="text-xs">{reference.position}</span>
                        <span className="text-xs">{reference.phone}</span>
                        <span className="text-xs">{reference.email}</span>
                        <div className="mt-2 text-sm">
                          <ReactMarkdown>{reference.description}</ReactMarkdown>
                        </div> */}
                      </div>
                    ))}
                </div>
              </div>
            )}
            {data.extras && data.extras.enable && (
              <div>
                <div className="my-4 mx-5 border-t border-b border-gray-400">
                  <h6 className="font-bold uppercase">{data.extras.heading}</h6>
                </div>
                {data.extras.items
                  .filter((x) => x.enable)
                  .map((extra) => (
                    <div key={extra.id} className="px-5 my-2">
                      <h6 className="text-xs font-bold">{extra.title}</h6>
                      <div className="text-sm">{extra.description}</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="col-span-6">
            {data.work && data.work.enable && (
              <div>
                <div className="my-4 mx-5 border-t border-b border-gray-400">
                  <h6 className="font-bold uppercase">{data.work.heading}</h6>
                </div>
                {data.work.items
                  .filter((x) => x.enable)
                  .map((work) => (
                    <div key={work.id} className="my-3 px-5">
                      <div className="flex justify-between items-center">
                        <div>
                          <h6 className="font-semibold">{work.position}</h6>
                          <p className="text-xs">
                            {work.company}
                            <span className="text-xs font-medium">
                              | {work.startDate} - {work.endDate}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <ReactMarkdown>{work.description}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {data.education && data.education.enable && (
              <div>
                <div className="my-4 mx-5 border-t border-b border-gray-400">
                  <h6 className="font-bold uppercase">{data.education.heading}</h6>
                </div>
                {data.education.items
                  .filter((x) => x.enable)
                  .map((education) => (
                    <div key={education.id} className="my-3 px-5">
                      <div className="flex justify-between items-center">
                        <div>
                          <h6 className="font-semibold">{education.institution}</h6>
                          <p className="text-xs">
                            {education.degree}
                            <span className="text-xs font-medium">
                              | {education.graduationDate}
                            </span>
                          </p>
                          {/* <p className="text-sm font-medium">GPA: {education}</p> */}
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        {/* <ReactMarkdown>{education.description}</ReactMarkdown> */}
                      </div>
                    </div>
                  ))}
              </div>
            )}
            <div className="grid grid-cols-2">
              {data.hobbies && data.hobbies.enable && (
                <div>
                  <div className="my-4 mx-5 border-t border-b border-gray-400 uppercase">
                    <h6 className="font-bold uppercase">{data.hobbies.heading}</h6>
                  </div>
                  <ul className="list-none px-5">
                    {data.hobbies.items
                      .filter((hobby) => hobby.enable)
                      .map((hobby) => (
                        <li key={hobby.id} className="text-sm my-2">
                          {hobby.name}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
              {data.certifications && data.certifications.enable && (
                <div>
                  <div className="my-4">
                    <h6 className="pl-5 font-bold uppercase">{data.certifications.heading}</h6>
                  </div>
                  {data.certifications.items
                    .filter((x) => x.enable)
                    .map((certification) => (
                      <div key={certification.id} className="my-3 px-5">
                        <h6 className="font-semibold">{certification.name}</h6>
                        <p className="text-xs">{certification.authority}</p>
                        <div className="mt-2 text-sm">
                          {/* <ReactMarkdown>{certification.description}</ReactMarkdown> */}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            {data.languages && data.languages.enable && (
              <div>
                <div className="my-4">
                  <h6 className="pl-5 font-bold uppercase">{data.languages.heading}</h6>
                </div>
                {data.languages.items
                  .filter((x) => x.enable)
                  .map((language) => (
                    <div key={language.id} className="px-5 mb-6">
                      <div className="flex flex-col my-2">
                        <div className="grid grid-cols-2">
                          <div className="flex justify-between items-center">
                            <h6 className="text-sm font-medium mb-1">{language.language}</h6>
                            {language.proficiency && (
                              <div className="font-bold text-sm">{language.proficiency}</div>
                            )}
                          </div>
                          {/* <div className="relative h-5">
                            <div className="absolute mb-1 inset-0"></div>
                            <div
                              className="absolute mb-1 inset-0 rounded"
                              style={{
                                width: `${(Number(language.rating) / 5) * 100 || 1}%`,
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                              }}
                            ></div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhiteMinimalist