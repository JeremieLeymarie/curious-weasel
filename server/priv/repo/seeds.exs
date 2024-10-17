# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     TimeTracker.Repo.insert!(%TimeTracker.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

if TimeTracker.Repo.aggregate(TimeTracker.UserContext.User, :count, :id) == 0 do
  TimeTracker.UserContext.create_user(%{
    "username" => "admin",
    "email" => "admin@admin.com",
    "role" => :general_manager,
    "hash_password" => "password"
  })
end
