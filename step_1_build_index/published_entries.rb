require 'fileutils'
require 'json'
require 'open3'

require_relative './export'

Pageflow::Revision
  .published
  .joins(:entry)
  .order(published_at: :desc)
  .each do |revision|

    export = Export.new(revision)
    dir = Pathname.new(__dir__).join('../entries')
    puts export.canonical_url

    Open3.capture3("wget",
      "--adjust-extension",
      "--convert-links",
      "--domains=hu.scrollytelling.io,scrollytelling.link",
      "--https-only",
      "--mirror",
      "--output-file=crawler.log",
      "--page-requisites",
      "--reject robots.txt",
      "--span-hosts",
      "--timestamping",
      export.canonical_url, chdir: dir)

    index = dir.join(export.host, 'index.json')

    attributes = index.exist? ? JSON.parse(index.read) : export.defaults
    attributes['entries'].push export.attributes

    # Sort entries on something the database can't do:
    # attributes['entries'].sort_by! { |entry| entry['title'] }

    File.open(index, 'wt') do |file|
      file.write(JSON.pretty_generate(attributes))
    end
end