require 'sinatra'
require 'sinatra/contrib/all'
require 'pg'
require 'pry'

get '/' do
  erb :index
end

get '/videos' do 
  sql = 'select * from videos'
  @videos = run_sql(sql)
  if request.xhr?
    json @videos.to_a
  else
    erb :index
  end 
end

post '/videos' do 
  sql = "insert into videos (name, details, url, genre) values ('#{params[:name]}', '#{params[:details]}', '#{params[:url]}', '#{params[:genre]}') returning *"
  @video = run_sql(sql).first
  if request.xhr?
    json @video
  else
    erb :index
  end
end

get '/videos/:id' do 
  sql = "select * from videos where id = #{params[:id]}"
  @video = run_sql(sql).first
  if request.xhr?
    json @video
  else
    erb :index
  end
end

put '/videos/:id' do
  sql = "update videos set name='#{params[:name]}', details='#{params[:details]}', params='#{params[:genre]}' where id='#{params[:id]}'"
  run_sql(sql)
  if request.xhr?
    json [{status: :ok}]
  else
    redirect_to '/videos'
  end
end

private

def run_sql(sql)
  conn = PG.connect(dbname: 'goalstube', host: 'localhost')
  begin
    result = conn.exec(sql)
  ensure
    conn.close
  end
  result
end