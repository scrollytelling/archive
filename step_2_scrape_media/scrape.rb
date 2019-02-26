require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)
require 'json'
require 'find'
require 'pathname'
require 'fileutils'
require 'uri'

require_relative './screenshot'
require_relative './admin_session'
require_relative '../lib/account'
require_relative './story'
require_relative './bucket_downloader'

# Turns a live link to an asset into one we use for archives.
def archive_path(url)
  URI.unescape(url)
    .sub('https://', '')
    .sub(/\?\d+\z/, '')
end

$account = Account.new hostname

session = AdminSession.new
session.login

index = JSON.parse($account.index.read)
total = index['entries'].length
index['entries'].each_with_index do |entry, num|

  puts
  puts "== scraping #{num + 1} of #{total}: #{entry['canonical_url']}"
  story = Story.new(entry)

  %w(video_files image_files audio_files).each do |filetype|
    entry[filetype] = []

    hosted_files = session.hosted_files(story.slug, filetype)
    BucketDownloader.file_download hosted_files

    JSON
      .parse(hosted_files)
      .each do |file|

      if file['original_url']
        archived = $account.root.join archive_path(file['original_url'])

        if archived.exist?
          file['path'] = archive_path(file['original_url'])
          file['sha256'] = Digest::SHA256.file(archived)
          file['size'] = archived.size
          file['content_type'] ||= MimeMagic.by_path(archived).type
        else
          $account.root.join('MISSING').write("#{archived}\n", 'at')
          next
        end
      end

      file['sources']&.each do |source|
        if (source['src'])
          # change https://output.scroll to /output.scroll
          source['path'] = archive_path(source.delete('src'))
        end
      end

      entry[filetype] << file.slice(
        'content_type',
        'file_name',
        'height',
        'id',
        'path',
        'rights',
        'sha256',
        'size',
        'sources',
        'variants',
        'width'
      )

      # intermediate savepoint
      $account.index.write(JSON.pretty_generate(index), mode: 'wt')
    end

  end

  # We have all the files. Grab the screens next.
  screenshot = Screenshot.new story
  entry['screenshots'] = screenshot.create_all!

  $account.index.write(JSON.pretty_generate(index), mode: 'wt')
  puts
end
