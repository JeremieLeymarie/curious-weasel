defmodule TimeTracker.UserContextFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `TimeTracker.UserContext` context.
  """

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    default_attrs = %{
      email => "someemail@lgbtq.com",
      username => "some username"
    }

    merged_attrs = Enum.into(attrs, default_attrs)

    {:ok, user} = TimeTracker.UserContext.create_user(merged_attrs)
    user
  end

end
