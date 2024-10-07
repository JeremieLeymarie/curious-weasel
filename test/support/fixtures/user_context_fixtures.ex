defmodule TimeTracker.UserContextFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `TimeTracker.UserContext` context.
  """

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        email: "some email",
        username: "some username"
      })
      |> TimeTracker.UserContext.create_user()

    user
  end
end
